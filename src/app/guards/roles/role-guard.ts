import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Roles } from '../../shared-modules/service/auth.service';
import { AuthService } from '../../shared-modules/service/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const allowedRoles = route.data?.['roles'] as Roles[] | undefined;

  const userRoles = authService.tokenPersonalizedData?.roles;

  if (!allowedRoles) return true;

  return allowedRoles.some((role) => userRoles?.includes(role)) ? true : router.createUrlTree(['/forbidden']);
};
