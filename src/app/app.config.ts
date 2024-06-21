import { tokenHttpInterceptor } from './interceptors/token-http-interceptor';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IMAGE_CONFIG } from '@angular/common';
import { ErrorResponseInterceptor } from './interceptors/error-response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions({skipInitialTransition: true})), 
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenHttpInterceptor, ErrorResponseInterceptor])), provideAnimationsAsync(),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true, 
        disableImageLazyLoadWarning: true
      }
    },
     ]
};
