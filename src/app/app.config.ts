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
import { FrontAuthService } from './shared-modules/service/front-auth.service';

import { environment } from '../environments/environment';
import { MessageService } from 'primeng/api';

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
    MessageService,
    provideApi(environment.apiUrl),
    provideAppInitializer(initAuth),
    provideHttpClient(withInterceptors([JwtInterceptor])),
  ],
};

function initAuth() {
  const frontAuthService = inject(FrontAuthService);

  if (!frontAuthService.hasOneTokenAndNotExpired()) {
    frontAuthService.logout();
    frontAuthService.authReady.set(true);
    return;
  }

  frontAuthService.isLoggedVerified().subscribe({
    next: (isVerified) => {
      if (!isVerified) {
        frontAuthService.logout();
      } else {
        frontAuthService.loadingLogginYouBackIn.set(true);
      }
    },
    error: () => {
      frontAuthService.logout();
    },
    complete: () => {
      frontAuthService.authReady.set(true);
    }
  });
}
