import { tokenHttpInterceptor } from './interceptors/token-http-interceptor';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IMAGE_CONFIG } from '@angular/common';
import { ErrorResponseInterceptor } from './interceptors/error-response.interceptor';

import {LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';
registerLocaleData(localeEs, 'es'); //Esto no es un import, 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, 
      withComponentInputBinding(), withViewTransitions({skipInitialTransition: true})), 
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenHttpInterceptor, ErrorResponseInterceptor, spinnerInterceptor])), provideAnimationsAsync(), provideAnimationsAsync(),
    {
      provide: LOCALE_ID, useValue: 'es'
    }
     ]
};
