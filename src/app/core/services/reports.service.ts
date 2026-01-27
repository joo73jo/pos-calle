import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class ReportsService {

    async salesByDateRange(params: {
        from: string; // 'YYYY-MM-DD'
        to: string;   // 'YYYY-MM-DD'
        vendedor_id?: string | null;
        tipo_venta?: 'local' | 'domicilio' | '';
        metodo_pago_cliente?: 'efectivo' | 'transferencia' | 'tarjeta' | '';
    }) {
        // rango inclusivo -> hacemos to + 1 día
        const toPlus1 = new Date(params.to);
        toPlus1.setDate(toPlus1.getDate() + 1);
        const toISO = toPlus1.toISOString();

        let q = supabase
            .from('sales')
            .select(`
            sale_id, created_at, vendedor_id, tipo_venta, metodo_pago_cliente, total, estado, notas,
            deliveries ( delivery_id, repartidor_id, estado_entrega, estado_efectivo, deuda_pendiente, cancelado ),
            sale_items ( product_id, cantidad, precio_unitario, subtotal )
            `)

            .gte('created_at', new Date(params.from).toISOString())
            .lt('created_at', toISO)
            .order('created_at', { ascending: false });

        if (params.vendedor_id) q = q.eq('vendedor_id', params.vendedor_id);
        if (params.tipo_venta) q = q.eq('tipo_venta', params.tipo_venta);
        if (params.metodo_pago_cliente) q = q.eq('metodo_pago_cliente', params.metodo_pago_cliente);

        const { data, error } = await q;
        if (error) throw error;

        const sales = data ?? [];

        // Resúmenes (solo registradas)
        const valid = sales.filter(s => s.estado === 'registrada');

        const totalVentas = valid.reduce((acc, s) => acc + Number(s.total), 0);
        const numVentas = valid.length;

        const desglosePago: Record<string, number> = { efectivo: 0, transferencia: 0, tarjeta: 0 };
        for (const s of valid) desglosePago[s.metodo_pago_cliente] += Number(s.total);

        // Top productos (por cantidad)
        const top: Record<string, number> = {};
        for (const s of valid) {
            for (const it of (s.sale_items ?? [])) {
                top[it.product_id] = (top[it.product_id] ?? 0) + Number(it.cantidad);
            }
        }

        // convertir a lista ordenada
        const topProductos = Object.entries(top)
            .map(([product_id, cantidad]) => ({ product_id, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 10);

        const domicilioVsLocal = {
            local: valid.filter(s => s.tipo_venta === 'local').reduce((a, s) => a + Number(s.total), 0),
            domicilio: valid.filter(s => s.tipo_venta === 'domicilio').reduce((a, s) => a + Number(s.total), 0),
        };

        return {
            sales,
            resumen: {
                totalVentas: Math.round(totalVentas * 100) / 100,
                numVentas,
                desglosePago,
                topProductos,
                domicilioVsLocal
            }
        };
    }
}
