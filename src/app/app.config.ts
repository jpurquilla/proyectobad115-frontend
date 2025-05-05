import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importar provideAnimationsAsync
import { providePrimeNG } from 'primeng/config'; // Importar providePrimeNG
import Lara from '@primeng/themes/lara'; // Importar el preset Lara

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(), // Añadir provideAnimationsAsync
    providePrimeNG({ // Añadir providePrimeNG
      theme: {
        preset: Lara // Configurar el preset Lara
      }
    })
  ]
};
