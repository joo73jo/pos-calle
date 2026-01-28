import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { DeliveriesService } from '../../core/services/deliveries.service';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './seguimiento.page.html',
})
export class SeguimientoPage implements OnInit, OnDestroy {

  deliveries: any[] = [];
  timer: any = null;

  constructor(
    private api: DeliveriesService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.load();
    // refresco simple cada 10s (MVP)
    this.timer = setInterval(() => this.load(), 10000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async load() {
    try {
      // necesitas este método (abajo te lo doy)
      this.deliveries = await this.api.listActivos();
    } catch (e:any) {
      this.toast(e?.message ?? 'Error cargando seguimiento', 'danger');
    }
  }

  private async toast(message: string, color: 'success'|'danger'|'warning'|'primary'='success') {
    const t = await this.toastCtrl.create({ message, duration: 1500, position: 'top', color });
    await t.present();
  }
}
