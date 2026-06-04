import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Roles } from '../../shared-modules/service/auth.service';
import { AuthService } from '../../shared-modules/service/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const allowedRoles = route.data?.['roles'] as Roles[] | undefined;

  const userRole = authService.tokenPersonalizedData?.role;

  if (!allowedRoles) return true;

  return allowedRoles.includes(userRole as Roles) ? true : router.createUrlTree(['/forbidden']);
};
