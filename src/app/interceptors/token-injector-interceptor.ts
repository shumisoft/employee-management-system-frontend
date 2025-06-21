import {
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';

export const tokenInjectorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isAuthRequest = req.url.includes('/auth');

  const authReq = !isAuthRequest
    ? req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${authService.getAccessToken()}`,
        }),
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only intercept expired-access-token cases
      if (error.status === 403 && !isAuthRequest) {
        console.warn('[tokenInjectorInterceptor] Access Token expired!');
        console.info('[tokenInjectorInterceptor] Attempting token refresh...');

        return authService.refreshToken().pipe(
          switchMap((data) => {
            //Store new
            authService.storeResponse(data);

            console.info(
              '[tokenInjectorInterceptor] Token refreshed successfully!',
            );

            // Retry original request with new token
            const retryReq = req.clone({
              headers: new HttpHeaders({
                Authorization: `Bearer ${data.token}`,
              }),
            });

            console.info(
              '[tokenInjectorInterceptor] Retrying original request with new token...', req.url
            );

            return next(retryReq);
          }),
          catchError((refreshError: HttpErrorResponse) => {
            // Refresh failed → hard logout
            console.warn('[tokenInjectorInterceptor] Refresh token failed!');
            console.error(
              '[tokenInjectorInterceptor] Refresh token failure error object:',
              refreshError,
            );
            if (refreshError.status === 401 || refreshError.status === 403) {
              console.info('[tokenInjectorInterceptor] Logging out...');
              authService.logout();
            }

            return throwError(() => refreshError);
          }),
        );
      }

      // Any other error → pass through untouched
      return throwError(() => error);
    }),
  );
};
