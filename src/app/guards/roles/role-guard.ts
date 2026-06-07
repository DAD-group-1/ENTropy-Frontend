import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Roles } from '../../shared-modules/service/front-auth.service';
import { FrontAuthService } from '../../shared-modules/service/front-auth.service';


export const roleGuard: CanActivateFn = (route) => {
  const normalizeRoles = (roles: string[] = []) => roles.map((r) => r.toLowerCase());

  const router = inject(Router);
  const frontAuthService = inject(FrontAuthService);

  const allowedRoles = route.data?.['allowed_roles'] as Roles[] | undefined;
  const excludedRoles = route.data?.['excluded_roles'] as Roles[] | undefined;

  const userRoles = normalizeRoles(frontAuthService.tokenPersonalizedData?.roles ?? []);

  const normalizedAllowed = allowedRoles ? normalizeRoles(allowedRoles) : undefined;
  const normalizedExcluded = excludedRoles ? normalizeRoles(excludedRoles) : undefined;

  if (normalizedExcluded?.some((role) => userRoles.includes(role))) {
    return router.createUrlTree(['/forbidden']);
  }

  if (!normalizedAllowed) return true;

  const isAllowed = normalizedAllowed.some((role) => userRoles.includes(role));

  return isAllowed ? true : router.createUrlTree(['/forbidden']);
};
