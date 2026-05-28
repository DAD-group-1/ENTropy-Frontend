import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import ENTropyPreset from './ENTropyPreset';

import { routes } from './app.routes';
import { provideApi } from './core/data-services';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: ENTropyPreset,
        options: {
          prefix: 'p',
          darkModeSelector: 'none',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideApi('http://localhost:3000'),
    provideHttpClient(withInterceptors([JwtInterceptor])),
  ],
};
