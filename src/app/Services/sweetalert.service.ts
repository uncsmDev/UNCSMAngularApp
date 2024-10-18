import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  theme: any;
  constructor() {
    this.theme = this.isDarkMode() ? this.getDarkTheme() : this.getLightTheme();
   }

  isDarkMode(): boolean {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  getDarkTheme() {
    return {
      background: '#263238',
      color: '#fff',
      confirmButtonColor: '#3085d6',
    };
  }

  // Configuración de SweetAlert para el tema claro
  getLightTheme() {
    return {
      background: '#fff',
      color: '#000',
      confirmButtonColor: '#3085d6',
    };
  }

}
