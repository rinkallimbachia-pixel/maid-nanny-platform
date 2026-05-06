import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, from, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('careNestToken');
  const shouldAttach = req.url.includes('http://localhost:4000/api/') && !req.headers.has('Authorization');
  const request = shouldAttach && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const refreshToken = localStorage.getItem('careNestRefreshToken');
      const isAuthEndpoint = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register') || req.url.includes('/api/auth/refresh');
      if (error.status !== 401 || !refreshToken || isRefreshing || isAuthEndpoint) {
        return throwError(() => error);
      }

      isRefreshing = true;
      return from(
        fetch('http://localhost:4000/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        }).then((response) => response.json())
      ).pipe(
        switchMap((payload: { token?: string; refreshToken?: string }) => {
          isRefreshing = false;
          if (!payload?.token || !payload?.refreshToken) {
            return throwError(() => error);
          }
          localStorage.setItem('careNestToken', payload.token);
          localStorage.setItem('careNestRefreshToken', payload.refreshToken);
          const retry = req.clone({ setHeaders: { Authorization: `Bearer ${payload.token}` } });
          return next(retry);
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          localStorage.removeItem('careNestToken');
          localStorage.removeItem('careNestRefreshToken');
          localStorage.removeItem('careNestAuth');
          return throwError(() => refreshError);
        })
      );
    })
  );
};
