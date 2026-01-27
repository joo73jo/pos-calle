import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AdminProductsService } from '../../core/services/admin-products.service';

@Component({
    standalone: true,
    selector: 'app-admin-productos',
    imports: [CommonModule, IonicModule, FormsModule],
    templateUrl: './admin-productos.page.html',
})
export class AdminProductosPage implements OnInit {

    products: any[] = [];

    // CREAR
    form = { nombre: '', precio_venta: 0, stock_actual: 0, activo: true };
    selectedFile: File | null = null;

    // EDITAR (panel)
    editing: any = null;
    editForm = { nombre: '', precio_venta: 0, stock_actual: 0, activo: true };
    editFile: File | null = null;

    constructor(
        private api: AdminProductsService,
        private toastCtrl: ToastController
    ) { }

    async ngOnInit() {
        await this.load();
    }

    async load() {
        this.products = await this.api.listProducts();
    }

    imgUrl(path: string | null) {
        return this.api.getPublicImageUrl(path);
    }

    // ======= CREAR =======
    onFile(ev: any) {
        const f: File = ev.target.files?.[0];
        this.selectedFile = f ?? null;
    }

    async create() {
        try {
            let image_path: string | null = null;

            if (this.selectedFile) {
                image_path = `products/${crypto.randomUUID()}-${this.selectedFile.name}`;
                await this.api.uploadProductImage(this.selectedFile, image_path);
            }

            await this.api.createProduct({
                ...this.form,
                image_path
            });

            this.form = { nombre: '', precio_venta: 0, stock_actual: 0, activo: true };
            this.selectedFile = null;

            await this.load();
            this.toast('Producto creado', 'success');
        } catch (e: any) {
            this.toast(e?.message ?? 'Error al crear', 'danger');
        }
    }

    // ======= EDITAR =======
    startEdit(p: any) {
        this.editing = p;
        this.editForm = {
            nombre: p.nombre,
            precio_venta: Number(p.precio_venta),
            stock_actual: Number(p.stock_actual),
            activo: !!p.activo
        };
        this.editFile = null;
    }

    cancelEdit() {
        this.editing = null;
        this.editFile = null;
    }

    onEditFile(ev: any) {
        const f: File = ev.target.files?.[0];
        this.editFile = f ?? null;
    }

    async saveEdit() {
        if (!this.editing) return;

        try {
            let image_path: string | null = this.editing.image_path ?? null;

            // ✅ si eligió nueva foto, subir y reemplazar image_path
            if (this.editFile) {
                image_path = `products/${crypto.randomUUID()}-${this.editFile.name}`;
                await this.api.uploadProductImage(this.editFile, image_path);
            }

            await this.api.updateProduct(this.editing.product_id, {
                nombre: this.editForm.nombre,
                precio_venta: Number(this.editForm.precio_venta),
                stock_actual: Number(this.editForm.stock_actual),
                activo: this.editForm.activo,
                image_path
            });

            await this.load();
            this.toast('Producto actualizado', 'success');
            this.cancelEdit();
        } catch (e: any) {
            this.toast(e?.message ?? 'Error al actualizar', 'danger');
        }
    }

    // ======= OTROS =======
    async toggleActivo(p: any) {
        try {
            await this.api.updateProduct(p.product_id, { activo: !p.activo });
            await this.load();
        } catch (e: any) {
            this.toast(e?.message ?? 'Error', 'danger');
        }
    }

    async remove(p: any) {
        try {
            await this.api.deleteProduct(p.product_id);
            await this.load();
            this.toast('Eliminado', 'success');
        } catch (e: any) {
            this.toast(e?.message ?? 'Error', 'danger');
        }
    }

    private async toast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'success') {
        const t = await this.toastCtrl.create({
            message,
            duration: 1800,
            position: 'top',
            color,
            icon: color === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline',
            cssClass: 'toast-pretty'
        });
        await t.present();
    }
}
