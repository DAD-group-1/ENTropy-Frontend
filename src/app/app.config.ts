import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import ENTropyPreset from './ENTropyPreset';

import { routes } from './app.routes';
import { provideApi } from './core/data-services';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt-interceptor';
import { AuthService } from './shared-modules/service/auth.service';

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
    provideAppInitializer(initAuth),
    provideHttpClient(withInterceptors([JwtInterceptor])),
  ],
};

function initAuth() {
  const authService = inject(AuthService);

  if (!authService.hasOneTokenAndNotExpired()) {
    authService.logout();
    authService.authReady.set(true);
    return;
  }

  authService.isLoggedVerified().subscribe({
    next: (isVerified) => {
      if (!isVerified) {
        authService.logout();
      } else {
        authService.loadingLogginYouBackIn.set(true);
      }
    },
    error: () => {
      authService.logout();
    },
    complete: () => {
      authService.authReady.set(true);
    }
  });
}
