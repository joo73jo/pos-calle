import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { SalesService, CartItem, TipoVenta, MetodoPago } from '../../core/services/sales.service';
import { AdminProductsService } from '../../core/services/admin-products.service';

@Component({
  standalone: true,
  selector: 'app-pos',
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss'],
})
export class PosPage implements OnInit {

  products: any[] = [];
  repartidores: any[] = [];
  cart: CartItem[] = [];

  tipo_venta: TipoVenta = 'local';
  metodo_pago_cliente: MetodoPago = 'efectivo';
  repartidor_id: string | null = null;
  notas: string = '';

  loading = false;

  constructor(
    private sales: SalesService,
    private adminProducts: AdminProductsService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.products = await this.sales.getActiveProducts();
    this.repartidores = await this.sales.getActiveRepartidores();
  }

  imgUrl(path: string | null) {
    return this.adminProducts.getPublicImageUrl(path);
  }

  addToCart(p: any) {
    const found = this.cart.find(i => i.product_id === p.product_id);
    if (found) found.cantidad += 1;
    else {
      this.cart.push({
        product_id: p.product_id,
        nombre: p.nombre,
        precio_venta: Number(p.precio_venta),
        cantidad: 1
      });
    }
  }

  inc(it: CartItem) { it.cantidad += 1; }
  dec(it: CartItem) { it.cantidad = Math.max(1, it.cantidad - 1); }

  remove(it: CartItem) {
    this.cart = this.cart.filter(x => x.product_id !== it.product_id);
  }

  total() {
    return this.sales.calcTotal(this.cart);
  }

  async createSale() {
    if (this.cart.length === 0) return this.showToast('Carrito vacío');

    if (this.tipo_venta === 'domicilio' && !this.repartidor_id) {
      return this.showToast('Para domicilio debes asignar repartidor');
    }

    const confirm = await this.alertCtrl.create({
      header: 'Confirmar venta',
      message: `Total: $${this.total().toFixed(2)}. ¿Deseas registrar la venta?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Sí, registrar', role: 'confirm' }
      ]
    });

    await confirm.present();
    const { role } = await confirm.onDidDismiss();
    if (role !== 'confirm') return;

    try {
      this.loading = true;

      const saleId = await this.sales.createSalePOS({
        tipo_venta: this.tipo_venta,
        metodo_pago_cliente: this.metodo_pago_cliente,
        cart: this.cart,
        repartidor_id: this.repartidor_id,
        notas: this.notas || null
      });

      this.cart = [];
      this.repartidor_id = null;
      this.notas = '';
      await this.load();

      this.showToast(`Venta registrada ✅ (${saleId.slice(0, 8)})`);
    } catch (e: any) {
      this.showToast(e?.message ?? 'Error al registrar venta');
    } finally {
      this.loading = false;
    }
  }

  private async showToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1800, position: 'bottom' });
    await t.present();
  }
}
