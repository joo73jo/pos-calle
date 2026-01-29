import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private router: Router) {
    App.addListener('appUrlOpen', ({ url }) => {
      // Si vuelve desde confirmación
      if (url?.startsWith('poscalle://auth-callback')) {
        // manda al login
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    });
  }
}
