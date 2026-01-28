import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private sb = supabase;

  async listProducts() {
    const { data, error } = await this.sb
      .from('products')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return data ?? [];
  }

  async createMovement(
    vendedor_id: string,
    product_id: string,
    tipo: 'produccion' | 'merma' | 'ajuste',
    cantidad: number,
    nota?: string
  ) {
    if (tipo === 'merma' && cantidad > 0) {
      cantidad = -Math.abs(cantidad);
    }

    const { error: e1 } = await this.sb
      .from('inventory_movements')
      .insert({
        vendedor_id,
        product_id,
        tipo,
        cantidad,
        nota
      });

    if (e1) throw e1;

    // actualizar stock
    const { data, error: e2 } = await this.sb
      .rpc('update_product_stock', {
        p_product_id: product_id,
        p_delta: cantidad
      });

    if (e2) throw e2;
    return data;
  }
}
