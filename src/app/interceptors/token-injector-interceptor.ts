import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const tokenInjectorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (!req.url.includes('auth')) {
    req = req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${authService.getAccessToken()}`,
      }),
    });
  }

  return next(req);
};
