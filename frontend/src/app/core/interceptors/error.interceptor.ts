import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Intentar obtener mensaje del servidor
      let message = error.error?.message || 'Error inesperado. Inténtalo de nuevo más tarde.';

      if (error.status === 0) {
        message = 'No hay conexión con el servidor.';
      } else if (error.status === 401) {
        message = 'Sesión no válida. Vuelve a iniciar sesión.';
      } else if (error.status === 403) {
        message = 'No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        message = error.error?.message || 'Recurso no encontrado.';
      }

      toast.error(message);
      return throwError(() => error);
    })
  );
};
