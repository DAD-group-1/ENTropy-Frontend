import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Roles } from '../../shared-modules/service/front-auth.service';
import { FrontAuthService } from '../../shared-modules/service/front-auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const frontAuthService = inject(FrontAuthService);

  const allowedRoles = route.data?.['roles'] as Roles[] | undefined;

  const userRoles = frontAuthService.tokenPersonalizedData?.roles;

  if (!allowedRoles) return true;

  return allowedRoles.some((role) => userRoles?.includes(role)) ? true : router.createUrlTree(['/forbidden']);
};
