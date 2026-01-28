import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-tabs-vendedor',
  templateUrl: './tabs-vendedor.page.html',
  styleUrls: ['./tabs-vendedor.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class TabsVendedorPage {
  constructor(private auth: AuthService, private router: Router) {}

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
