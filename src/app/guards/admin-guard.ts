import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService._isAdmin()) {
    alert('Access denied! Administrator privileges are required.');

    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
