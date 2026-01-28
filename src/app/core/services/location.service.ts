import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class LocationService {

  async ensurePermission(): Promise<boolean> {
    const perm = await Geolocation.requestPermissions();
    return perm.location === 'granted' || perm.coarseLocation === 'granted';
  }

  async getCurrent(highAccuracy = true) {
    const ok = await this.ensurePermission();
    if (!ok) throw new Error('Permiso de ubicación no concedido');

    return Geolocation.getCurrentPosition({ enableHighAccuracy: highAccuracy });
  }
}
