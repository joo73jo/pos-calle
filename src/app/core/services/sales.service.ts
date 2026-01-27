import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta';
export type TipoVenta = 'local' | 'domicilio';

export interface CartItem {
    product_id: string;
    nombre: string;
    precio_venta: number;
    cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class SalesService {

    async getActiveProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('product_id,nombre,precio_venta,stock_actual,activo,image_path')
            .eq('activo', true)
            .order('nombre', { ascending: true });

        if (error) throw error;
        return data ?? [];
    }

    async getActiveRepartidores() {
        const { data, error } = await supabase
            .from('profiles')
            .select('user_id,nombre,rol,activo')
            .eq('rol', 'repartidor')
            .eq('activo', true)
            .order('nombre', { ascending: true });

        if (error) throw error;
        return data ?? [];
    }

    calcTotal(cart: CartItem[]) {
        let total = 0;
        for (const it of cart) total += (Number(it.precio_venta) * Number(it.cantidad));
        return Math.round(total * 100) / 100;
    }

    async createSalePOS(params: {
        tipo_venta: TipoVenta;
        metodo_pago_cliente: MetodoPago;
        cart: CartItem[];
        repartidor_id?: string | null;
        notas?: string | null;
    }) {
        const items = params.cart.map(i => ({
            product_id: i.product_id,
            cantidad: i.cantidad
        }));

        const { data, error } = await supabase.rpc('create_sale_pos', {
            p_tipo_venta: params.tipo_venta,
            p_metodo_pago: params.metodo_pago_cliente,
            p_items: items,
            p_repartidor_id: params.repartidor_id ?? null,
            p_notas: params.notas ?? null
        });

        if (error) throw error; // data es sale_id
        return data as string;
    }

    async annulSale(sale_id: string) {
        const { error } = await supabase.rpc('annul_sale', { p_sale_id: sale_id });
        if (error) throw error;
    }
}
