import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { CashClosureService } from '../../core/services/cash-closure.service';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './cierre-caja.page.html',
})
export class CierreCajaPage implements OnInit {
  me: any = null;

  dateISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  efectivo_contado_en_caja = 0;

  resumen: any = null;
  diferencia = 0;

  constructor(
    private auth: AuthService,
    private cash: CashClosureService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.me = await this.auth.getMyProfile();
  }

  async calcular() {
    try {
      const { sales, deliveries } = await this.cash.getDayData(this.dateISO);
      this.resumen = this.cash.buildResume(sales, deliveries);
      this.diferencia = Number(this.efectivo_contado_en_caja) - Number(this.resumen.efectivo_teorico);
    } catch (e: any) {
      this.toast(e?.message ?? 'Error al calcular', 'danger');
    }
  }

  async guardar() {
    try {
      if (!this.resumen) throw new Error('Primero presiona CALCULAR');

      await this.cash.saveClosure({
        date: this.dateISO,
        vendedor_id: this.me.user_id,
        ...this.resumen,
        efectivo_contado_en_caja: Number(this.efectivo_contado_en_caja),
        diferencia: Number(this.diferencia),
        estado: 'cerrado'
      });

      this.toast('Cierre guardado', 'success');
    } catch (e: any) {
      this.toast(e?.message ?? 'Error al guardar', 'danger');
    }
  }

  private async toast(message: string, color: 'success'|'danger'|'warning'|'primary'='success') {
    const t = await this.toastCtrl.create({ message, duration: 1600, position: 'top', color });
    await t.present();
  }
}
