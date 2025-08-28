import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService)

  // ✅ check login first
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // ✅ check for allowed roles
  const allowedRoles = route.data?.['roles'] as string[];   // now correctly from route
  if (allowedRoles && !auth.hasRole(allowedRoles)) {
        // toast.error('Access denied. Admins only.'); // show toast
        toast.error(`Access denied. Allowed: ${allowedRoles.join(', ')}`);
        // router.navigate(['/products']);
    return false;
  }

  return true;
};
