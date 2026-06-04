import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FrontAuthService } from '../../shared-modules/service/front-auth.service';
import { catchError, map, of } from 'rxjs';

export const authCanMatchGuard: CanMatchFn = () => {
  const frontAuthService = inject(FrontAuthService);
  const router = inject(Router);

  if (frontAuthService.hasOneTokenAndNotExpired()) return true;

  return router.createUrlTree(['/login']);
};

export const authCanActivateGuard: CanActivateFn = () => {
  const frontAuthService = inject(FrontAuthService);
  const router = inject(Router);

  return frontAuthService.isLoggedVerified().pipe(
    map((isValid) => (isValid ? true : router.createUrlTree(['/login']))),
    catchError(() => {
      frontAuthService.logout();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
