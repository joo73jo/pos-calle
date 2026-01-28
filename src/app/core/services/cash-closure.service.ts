import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class CashClosureService {

  async getDayData(dateISO: string) {
    // dateISO: 'YYYY-MM-DD'
    const start = `${dateISO}T00:00:00.000Z`;
    const end = `${dateISO}T23:59:59.999Z`;

    const { data: sales, error: e1 } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', start)
      .lte('created_at', end)
      .eq('estado', 'registrada');
    if (e1) throw e1;

    const saleIds = (sales ?? []).map(s => s.sale_id);

    const { data: deliveries, error: e2 } = await supabase
      .from('deliveries')
      .select('*')
      .in('sale_id', saleIds.length ? saleIds : ['00000000-0000-0000-0000-000000000000']);
    if (e2) throw e2;

    return { sales: sales ?? [], deliveries: deliveries ?? [] };
  }

  buildResume(sales: any[], deliveries: any[]) {
    const total_local = sales.filter(s=>s.tipo_venta==='local').reduce((a,s)=>a+Number(s.total),0);
    const total_domicilio = sales.filter(s=>s.tipo_venta==='domicilio').reduce((a,s)=>a+Number(s.total),0);

    const total_efectivo = sales.filter(s=>s.metodo_pago_cliente==='efectivo').reduce((a,s)=>a+Number(s.total),0);
    const total_transf = sales.filter(s=>s.metodo_pago_cliente==='transferencia').reduce((a,s)=>a+Number(s.total),0);
    const total_tarjeta = sales.filter(s=>s.metodo_pago_cliente==='tarjeta').reduce((a,s)=>a+Number(s.total),0);

    const entregado = deliveries
      .filter(d=>d.estado_efectivo==='entregado_al_local')
      .reduce((a,d)=>a+Number(d.monto_entregado_al_local),0);

    const pendiente = deliveries
      .filter(d=>d.estado_efectivo==='pendiente' || d.estado_efectivo==='debe_al_local')
      .reduce((a,d)=>a+Number(d.deuda_pendiente),0);

    // Efectivo local real = ventas local en efectivo (entra directo)
    const efectivo_local = sales
      .filter(s=>s.tipo_venta==='local' && s.metodo_pago_cliente==='efectivo')
      .reduce((a,s)=>a+Number(s.total),0);

    const efectivo_teorico = efectivo_local + entregado;

    return {
      total_local, total_domicilio,
      total_efectivo_cliente: total_efectivo,
      total_transferencia: total_transf,
      total_tarjeta,
      total_efectivo_entregado_por_repartidores: entregado,
      total_efectivo_pendiente_repartidores: pendiente,
      efectivo_teorico
    };
  }

  async saveClosure(payload: any) {
    const { error } = await supabase.from('cash_closures').insert(payload);
    if (error) throw error;
  }
}
