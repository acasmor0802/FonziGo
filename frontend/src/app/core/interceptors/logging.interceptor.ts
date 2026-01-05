import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  
  // Solo loguear en desarrollo
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log(`[HTTP] ${req.method} ${req.urlWithParams}`);
  }

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse && window.location.hostname === 'localhost') {
          const elapsed = Date.now() - started;
          console.log(`[HTTP] ✓ ${req.method} ${req.urlWithParams} ${event.status} (${elapsed}ms)`);
        }
      },
      error: err => {
        if (window.location.hostname === 'localhost') {
          const elapsed = Date.now() - started;
          console.error(`[HTTP] ✗ ${req.method} ${req.urlWithParams} (${elapsed}ms)`, err);
        }
      }
    })
  );
};
