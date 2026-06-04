import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../shared-modules/service/auth.service';
import { catchError, map, of } from 'rxjs';

export const authCanMatchGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasOneTokenAndNotExpired()) return true;

  return router.createUrlTree(['/login']);
};

export const authCanActivateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedVerified().pipe(
    map((isValid) => (isValid ? true : router.createUrlTree(['/login']))),
    catchError(() => {
      authService.logout();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
