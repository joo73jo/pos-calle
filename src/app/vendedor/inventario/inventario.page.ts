import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../core/services/inventory.service';
import { AuthService } from '../../core/auth/auth.service';

type MovementTipo = 'produccion' | 'merma' | 'ajuste';

@Component({
  standalone: true,
  selector: 'app-inventario',
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  me: any = null;

  products: any[] = [];
  loading = false;

  // filtros
  q = '';
  onlyActivos = true;

  // modal / form movimiento
  modalOpen = false;
  selectedProduct: any = null;
  tipo: MovementTipo = 'produccion';
  cantidad = 0;
  nota = '';

  constructor(
    private auth: AuthService,
    private api: InventoryService,
    private toastCtrl: ToastController,
  ) {}

  async ngOnInit() {
    this.me = await this.auth.getMyProfile();
    await this.load();
  }

  async load(ev?: any) {
    try {
      this.loading = true;
      const data = await this.api.listProducts();

      // filtros simples en front
      const filtered = data
        .filter(p => (this.onlyActivos ? !!p.activo : true))
        .filter(p => (this.q.trim() ? (p.nombre ?? '').toLowerCase().includes(this.q.trim().toLowerCase()) : true));

      this.products = filtered;
    } catch (e: any) {
      this.toast(e?.message ?? 'Error cargando inventario', 'danger');
    } finally {
      this.loading = false;
      if (ev?.target) ev.target.complete();
    }
  }

  // ===== MODAL =====
  openMovement(p: any, tipo: MovementTipo) {
    this.selectedProduct = p;
    this.tipo = tipo;
    this.cantidad = 0;
    this.nota = '';
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedProduct = null;
  }

  // ===== GUARDAR MOVIMIENTO =====
  async saveMovement() {
    if (!this.selectedProduct) return;

    try {
      const c = Number(this.cantidad);

      if (!c || isNaN(c)) throw new Error('Ingresa una cantidad válida.');

      // reglas: producción y ajuste pueden ser + o -, pero para UX:
      // - producción normalmente positiva
      // - merma se ingresa positiva y el servicio la hace negativa
      // - ajuste: permitimos negativo o positivo (usuario decide)
      if (this.tipo === 'produccion' && c < 0) {
        throw new Error('Producción debe ser positiva.');
      }

      // bloquear stock negativo (para merma / ajuste negativo)
      const stock = Number(this.selectedProduct.stock_actual ?? 0);
      const delta = (this.tipo === 'merma') ? -Math.abs(c) : c;

      if (stock + delta < 0) {
        throw new Error(`No se puede dejar stock negativo. Stock actual: ${stock}`);
      }

      await this.api.createMovement(
        this.me.user_id,
        this.selectedProduct.product_id,
        this.tipo,
        c,
        this.nota?.trim() || undefined
      );

      this.toast('Movimiento registrado', 'success');
      this.closeModal();
      await this.load();
    } catch (e: any) {
      this.toast(e?.message ?? 'Error registrando movimiento', 'danger');
    }
  }

  // UI helpers
  stockLabel(p: any) {
    const s = Number(p.stock_actual ?? 0);
    return s.toFixed(3).replace(/\.?0+$/, '');
  }

  private async toast(message: string, color: 'success'|'danger'|'warning'|'primary'='success') {
    const t = await this.toastCtrl.create({
      message,
      duration: 1600,
      position: 'top',
      color
    });
    await t.present();
  }
}
