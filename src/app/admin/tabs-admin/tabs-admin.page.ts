import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonTabs, IonTabBar, IonTabButton,
  IonIcon, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs-admin',
  templateUrl: './tabs-admin.page.html',
  styleUrls: ['./tabs-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs, IonTabBar, IonTabButton,
    IonIcon, IonLabel
  ],
})
export class TabsAdminPage { }
