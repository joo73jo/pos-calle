import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DeliveriesService } from '../../core/services/deliveries.service';
import { AuthService } from '../../core/auth/auth.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})

export class PedidosPage implements OnInit, OnDestroy {

  me: any = null;
  deliveries: any[] = [];
  loading = false;

  gpsTimer: any = null;
  refreshTimer: any = null;

  gpsGranted = false;
  gpsError = '';

  constructor(
    private auth: AuthService,
    private api: DeliveriesService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.me = await this.auth.getMyProfile();
    await this.load();
    await this.ensureGpsPermission();
    this.startRefreshLoop();
    this.startGpsLoop();
  }

  ngOnDestroy() {
    if (this.gpsTimer) clearInterval(this.gpsTimer);
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  async load(ev?: any) {
    try {
      this.loading = true;
      this.deliveries = await this.api.listMine(this.me.user_id);
    } catch (e: any) {
      this.toast(e?.message ?? 'Error cargando pedidos', 'danger');
    } finally {
      this.loading = false;
      if (ev?.target) ev.target.complete();
    }
  }

  // ====== ESTADOS ENTREGA ======
  async setEntrega(d: any, estado: 'asignado'|'en_camino'|'entregado') {
    try {
      await this.api.setEstadoEntrega(d.delivery_id, estado);
      await this.load();
      this.toast('Estado actualizado', 'success');
    } catch (e:any) {
      this.toast(e?.message ?? 'Error', 'danger');
    }
  }

  // ====== EFECTIVO ======
  async efectivoEntregado(d: any) {
    try {
      if (Number(d.monto_efectivo_en_manos ?? 0) <= 0) {
        return this.toast('Este pedido no maneja efectivo.', 'warning');
      }
      await this.api.marcarEfectivoEntregado(d.delivery_id);
      await this.load();
      this.toast('Efectivo marcado como entregado', 'success');
    } catch (e:any) {
      this.toast(e?.message ?? 'Error', 'danger');
    }
  }

  async efectivoPendiente(d: any) {
    try {
      if (Number(d.monto_efectivo_en_manos ?? 0) <= 0) {
        return this.toast('Este pedido no maneja efectivo.', 'warning');
      }
      await this.api.marcarPendiente(d.delivery_id);
      await this.load();
      this.toast('Marcado como pendiente', 'success');
    } catch (e:any) {
      this.toast(e?.message ?? 'Error', 'danger');
    }
  }

  async efectivoDebe(d: any) {
    try {
      if (Number(d.monto_efectivo_en_manos ?? 0) <= 0) {
        return this.toast('Este pedido no maneja efectivo.', 'warning');
      }
      await this.api.marcarDebe(d.delivery_id);
      await this.load();
      this.toast('Marcado como debe', 'warning');
    } catch (e:any) {
      this.toast(e?.message ?? 'Error', 'danger');
    }
  }

  // ====== GPS ======
  async ensureGpsPermission() {
    try {
      const perm = await Geolocation.requestPermissions();
      this.gpsGranted = perm.location === 'granted' || perm.coarseLocation === 'granted';
      this.gpsError = this.gpsGranted ? '' : 'GPS no autorizado. Habilita permisos de ubicación.';
    } catch {
      this.gpsGranted = false;
      this.gpsError = 'No se pudo solicitar permisos de ubicación.';
    }
  }

  startGpsLoop() {
    // cada 15s
    this.gpsTimer = setInterval(async () => {
      try {
        if (!this.gpsGranted) return;

        const active = this.deliveries.find(x =>
          x.estado_entrega === 'asignado' || x.estado_entrega === 'en_camino'
        );
        if (!active) return;

        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
        await this.api.updateLocation(active.delivery_id, pos.coords.latitude, pos.coords.longitude);
      } catch {
        // no toast para no spamear
      }
    }, 15000);
  }

  startRefreshLoop() {
    // refresca lista cada 20s para ver cambios de vendedor/admin
    this.refreshTimer = setInterval(async () => {
      await this.load();
    }, 20000);
  }

  // ====== LOGOUT ======
  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  private async toast(message: string, color: 'success'|'danger'|'warning'|'primary'='success') {
    const t = await this.toastCtrl.create({ message, duration: 1500, position: 'top', color });
    await t.present();
  }
}
