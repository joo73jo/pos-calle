import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonText, IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonText, IonSpinner
  ],
})
export class HomePage {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    this.errorMsg = '';
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMsg = 'Debes llenar correo y contraseña';
      return;
    }

    try {
      this.loading = true;

      await this.auth.signIn(this.email.trim(), this.password);
      const profile = await this.auth.getMyProfile();

      if (!profile || !profile.activo) {
        this.errorMsg = 'No tienes perfil activo (profiles).';
        await this.auth.signOut();
        return;
      }

      // ✅ Normaliza rol (por si viene con espacios o mayúsculas)
      const rol = (profile.rol ?? '').trim().toLowerCase();

      if (rol === 'admin') {
        this.router.navigateByUrl('/tabs-admin', { replaceUrl: true });
        return;
      }

      if (rol === 'vendedor') {
        this.router.navigateByUrl('/tabs-vendedor', { replaceUrl: true });
        return;
      }

      if (rol === 'repartidor') {
        this.router.navigateByUrl('/tabs-repartidor', { replaceUrl: true });
        return;
      }

      // 🔴 Solo si el rol NO coincide
      this.errorMsg = 'Rol no reconocido en profiles.';
      await this.auth.signOut();

    } catch (e: any) {
      this.errorMsg = e?.message ?? 'No se pudo iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
