import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../shared-modules/service/auth.service';
import { AuthenticationService } from '../../core/data-services';
import { catchError, map, of } from 'rxjs';

export const authCanMatchGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasOneTokenAndNotExpired()) return true;

  return router.createUrlTree(['/login']);
};

export const authCanActivateGuard: CanActivateFn = () => {
  const auth = inject(AuthenticationService);

  return auth.authenticationVerifyToken().pipe(
    map(() => true),
    catchError(() => of(false)),
  );
};
