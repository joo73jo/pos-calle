import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  IonTabs, IonRouterOutlet, IonTabBar, IonTabButton,
  IonIcon, IonLabel,
  IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, receiptOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-tabs-admin',
  standalone: true,
  templateUrl: './tabs-admin.page.html',
  imports: [
    CommonModule,
    RouterLink,
    IonTabs, IonRouterOutlet, IonTabBar, IonTabButton,
    IonIcon, IonLabel,
    IonHeader, IonToolbar, IonTitle,
    IonButtons, IonButton
  ],
})
export class TabsAdminPage {

  constructor(private auth: AuthService, private router: Router) {
    addIcons({ cubeOutline, receiptOutline, logOutOutline });
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
