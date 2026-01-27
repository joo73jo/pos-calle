import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../core/services/reports.service';
import { SalesService } from '../../core/services/sales.service';

@Component({
    standalone: true,
    selector: 'app-admin-ventas',
    imports: [CommonModule, IonicModule, FormsModule],
    templateUrl: './admin-ventas.page.html',
})
export class AdminVentasPage {

    toMoney(val: any): string {
        const n = Number(val ?? 0);
        return n.toFixed(2);
    }

    from = new Date().toISOString().slice(0, 10);
    to = new Date().toISOString().slice(0, 10);

    tipo_venta: '' | 'local' | 'domicilio' = '';
    metodo_pago_cliente: '' | 'efectivo' | 'transferencia' | 'tarjeta' = '';

    result: any = null;
    loading = false;

    constructor(
        private reports: ReportsService,
        private sales: SalesService,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController
    ) { }

    async buscar() {
        try {
            this.loading = true;
            this.result = await this.reports.salesByDateRange({
                from: this.from,
                to: this.to,
                tipo_venta: this.tipo_venta,
                metodo_pago_cliente: this.metodo_pago_cliente,
            });
        } catch (e: any) {
            this.toast(e?.message ?? 'Error en reporte');
        } finally {
            this.loading = false;
        }
    }

    async anular(s: any) {
        const alert = await this.alertCtrl.create({
            header: 'Anular venta',
            message: `¿Anular esta venta por $${Number(s.total).toFixed(2)}?`,
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                { text: 'Sí, anular', role: 'confirm' }
            ]
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();
        if (role !== 'confirm') return;

        try {
            await this.sales.annulSale(s.sale_id);
            this.toast('Venta anulada ✅');
            await this.buscar();
        } catch (e: any) {
            this.toast(e?.message ?? 'No se pudo anular');
        }
    }

    private async toast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary') {
        const t = await this.toastCtrl.create({
            message,
            duration: 2200,
            position: 'top',
            color,
            cssClass: 'toast-pretty'
        });
        await t.present();
    }

}
