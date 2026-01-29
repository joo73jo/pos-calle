import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class DeliveriesService {
  private sb = supabase;

  async listMine(repartidor_id: string) {
    const { data, error } = await this.sb
      .from('deliveries')
      .select(`
        delivery_id,
        sale_id,
        repartidor_id,
        estado_entrega,
        estado_efectivo,
        monto_efectivo_en_manos,
        monto_entregado_al_local,
        deuda_pendiente,
        last_lat,
        last_lng,
        last_location_ts,
        updated_at,
        sales:sale_id (
          sale_id,
          total,
          metodo_pago_cliente,
          sale_items (
            cantidad,
            products ( nombre )
          )
        )
      `)
      .eq('repartidor_id', repartidor_id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async setEstadoEntrega(
    delivery_id: string,
    estado_entrega: 'asignado' | 'en_camino' | 'entregado'
  ) {
    const { error } = await this.sb
      .from('deliveries')
      .update({ estado_entrega })
      .eq('delivery_id', delivery_id);

    if (error) throw error;
  }

  async marcarEfectivoEntregado(delivery_id: string) {
    const { data, error } = await this.sb
      .from('deliveries')
      .select('monto_efectivo_en_manos')
      .eq('delivery_id', delivery_id)
      .single();

    if (error) throw error;

    const monto = Number(data?.monto_efectivo_en_manos ?? 0);
    if (monto <= 0) throw new Error('Este pedido no maneja efectivo.');

    const { error: e2 } = await this.sb
      .from('deliveries')
      .update({
        estado_efectivo: 'entregado_al_local',
        monto_entregado_al_local: monto,
        deuda_pendiente: 0,
      })
      .eq('delivery_id', delivery_id);

    if (e2) throw e2;
  }

  async marcarPendiente(delivery_id: string) {
    const { data, error } = await this.sb
      .from('deliveries')
      .select('monto_efectivo_en_manos')
      .eq('delivery_id', delivery_id)
      .single();

    if (error) throw error;

    const monto = Number(data?.monto_efectivo_en_manos ?? 0);

    const { error: e2 } = await this.sb
      .from('deliveries')
      .update({
        estado_efectivo: 'pendiente',
        deuda_pendiente: monto,
      })
      .eq('delivery_id', delivery_id);

    if (e2) throw e2;
  }

  async marcarDebe(delivery_id: string) {
    const { data, error } = await this.sb
      .from('deliveries')
      .select('monto_efectivo_en_manos, monto_entregado_al_local')
      .eq('delivery_id', delivery_id)
      .single();

    if (error) throw error;

    const enManos = Number(data?.monto_efectivo_en_manos ?? 0);
    const entregado = Number(data?.monto_entregado_al_local ?? 0);
    const deuda = Math.max(enManos - entregado, 0);

    const { error: e2 } = await this.sb
      .from('deliveries')
      .update({
        estado_efectivo: 'debe_al_local',
        deuda_pendiente: deuda,
      })
      .eq('delivery_id', delivery_id);

    if (e2) throw e2;
  }

  async updateLocation(delivery_id: string, lat: number, lng: number) {
    const { error } = await this.sb
      .from('deliveries')
      .update({
        last_lat: lat,
        last_lng: lng,
        last_location_ts: new Date().toISOString(),
      })
      .eq('delivery_id', delivery_id);

    if (error) throw error;
  }
  async createDelivery(params: {
    sale_id: string;
    repartidor_id: string;
    metodo_pago_cliente: 'efectivo' | 'transferencia' | 'tarjeta';
    total: number;
  }) {
    const monto = params.metodo_pago_cliente === 'efectivo' ? Number(params.total) : 0;

    const { error } = await this.sb.from('deliveries').insert({
      sale_id: params.sale_id,
      repartidor_id: params.repartidor_id,
      estado_entrega: 'asignado',
      estado_efectivo: 'pendiente',
      monto_efectivo_en_manos: monto,
      monto_entregado_al_local: 0,
      deuda_pendiente: monto,
    });
    if (error) throw error;
  }

  async listActivos() {
    const { data, error } = await this.sb
      .from('deliveries')
      .select(`
      delivery_id,
      sale_id,
      repartidor_id,
      estado_entrega,
      estado_efectivo,
      deuda_pendiente,
      monto_efectivo_en_manos,
      monto_entregado_al_local,
      last_lat,
      last_lng,
      last_location_ts,
      updated_at,
      sales:sale_id ( sale_id, total, metodo_pago_cliente, tipo_venta )
    `)
      .in('estado_entrega', ['asignado', 'en_camino'])
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }


}
