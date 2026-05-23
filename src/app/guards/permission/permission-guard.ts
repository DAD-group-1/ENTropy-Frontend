import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

export const permissionGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const userRole = localStorage.getItem('role'); // exemple
  const allowedRoles = route.data?.['roles'] as string[];

  //TODO: See how to implement permissions

  if (!allowedRoles || allowedRoles.includes(userRole ?? '')) {
    return true;
  }

  return router.createUrlTree(['/home']); // ou page "403"
};
