import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  private sb = supabase;

  async listRepartidoresActivos() {
    const { data, error } = await this.sb
      .from('profiles')
      .select('user_id,nombre,rol,activo')
      .eq('rol', 'repartidor')
      .eq('activo', true)
      .order('nombre');
    if (error) throw error;
    return data ?? [];
  }
}
