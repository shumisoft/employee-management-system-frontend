import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_URL } from './tokens/api.tokens';
import { tokenInjectorInterceptor } from './interceptors/token-injector-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInjectorInterceptor])),
    {
      provide: API_URL,
      useValue: 'https://ems-be-dev.dipanshushukla.com',
      // useValue: 'http://localhost:1337',
    },
  ],
};
