import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonText, IonSelect, IonSelectOption, IonSpinner
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { supabase } from '../../supabase.client';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.page.html',
    imports: [
        CommonModule, FormsModule, RouterLink,
        IonHeader, IonToolbar, IonTitle, IonContent,
        IonItem, IonLabel, IonInput, IonButton,
        IonCard, IonCardHeader, IonCardTitle, IonCardContent,
        IonText, IonSelect, IonSelectOption, IonSpinner
    ]
})
export class RegisterPage {
    nombre = '';
    email = '';
    password = '';
    rol: 'vendedor' | 'repartidor' = 'vendedor';

    loading = false;
    errorMsg = '';
    okMsg = '';

    constructor(private router: Router) { }

    async register() {
        this.errorMsg = '';
        this.okMsg = '';

        if (!this.nombre.trim() || !this.email.trim() || !this.password.trim()) {
            this.errorMsg = 'Debes llenar todos los campos';
            return;
        }

        try {
            this.loading = true;

            const { error } = await supabase.auth.signUp({
                email: this.email.trim(),
                password: this.password.trim(),
                options: {
                    emailRedirectTo: 'poscalle://auth-callback',
                    data: {
                        nombre: this.nombre.trim(),
                        rol: this.rol
                    }
                }
            });

            if (error) throw error;

            this.okMsg = 'Te enviamos un correo de confirmación. Confirma tu cuenta y luego inicia sesión.';
            setTimeout(() => this.router.navigateByUrl('/home', { replaceUrl: true }), 1200);

        } catch (e: any) {
            this.errorMsg = e?.message ?? 'No se pudo registrar';
        } finally {
            this.loading = false;
        }
    }
}
