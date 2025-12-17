import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Mostrar loading al inicio de la petición
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Ocultar loading cuando la petición termine (éxito o error)
      loadingService.hide();
    })
  );
};
