import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  templateUrl: './tabs-repartidor.page.html',
  styleUrls: ['./tabs-repartidor.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
})
export class TabsRepartidorPage {
  constructor(private auth: AuthService, private router: Router) {}

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}

