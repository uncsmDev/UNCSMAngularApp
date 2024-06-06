import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenHttpInterceptor } from './token-http-interceptor';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions({skipInitialTransition: true})), 
    provideAnimationsAsync(),

    provideHttpClient(withInterceptors([tokenHttpInterceptor])), provideAnimationsAsync()
  ]
};
