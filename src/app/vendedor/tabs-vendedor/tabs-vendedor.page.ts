import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs-vendedor',
  templateUrl: './tabs-vendedor.page.html',
  styleUrls: ['./tabs-vendedor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TabsVendedorPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
