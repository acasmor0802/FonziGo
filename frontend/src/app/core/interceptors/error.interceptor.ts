import { HttpInterceptorFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

/**
 * Token de contexto HTTP para omitir el toast de error.
 * Usar cuando el servicio maneja el error silenciosamente.
 * 
 * @example
 * ```typescript
 * import { HttpContext } from '@angular/common/http';
 * import { SKIP_ERROR_TOAST } from '../interceptors/error.interceptor';
 * 
 * this.http.get<T>(url, {
 *   context: new HttpContext().set(SKIP_ERROR_TOAST, true)
 * });
 * ```
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Omitir toast si el servicio maneja el error localmente
      if (req.context.get(SKIP_ERROR_TOAST)) {
        return throwError(() => error);
      }

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
