import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class AdminProductsService {

    async listProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('product_id,nombre,precio_venta,stock_actual,activo,image_path,updated_at')
            .order('nombre', { ascending: true });

        if (error) throw error;
        return data ?? [];
    }

    async createProduct(payload: {
        nombre: string;
        precio_venta: number;
        stock_actual: number;
        activo: boolean;
        image_path?: string | null;
    }) {
        const { data, error } = await supabase
            .from('products')
            .insert(payload)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async updateProduct(product_id: string, payload: Partial<{
        nombre: string;
        precio_venta: number;
        stock_actual: number;
        activo: boolean;
        image_path: string | null;
    }>) {
        const { data, error } = await supabase
            .from('products')
            .update(payload)
            .eq('product_id', product_id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async deleteProduct(product_id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('product_id', product_id);

        if (error) throw error;
    }

    // STORAGE
    async uploadProductImage(file: File, path: string) {
        const { error } = await supabase.storage
            .from('product-images')
            .upload(path, file, { upsert: true, contentType: file.type });

        if (error) throw error;

        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        return data.publicUrl;
    }

    getPublicImageUrl(path: string | null) {
        if (!path) return null;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        return data.publicUrl;
    }
}
