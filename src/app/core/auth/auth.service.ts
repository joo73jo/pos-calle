import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class AuthService {

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    getSession() {
        return supabase.auth.getSession();
    }

    onAuthStateChange(cb: (event: string) => void) {
        return supabase.auth.onAuthStateChange((event) => cb(event));
    }

    async getMyProfile() {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('user_id,nombre,rol,activo')
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data;
    }
}
