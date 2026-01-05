import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * URLs que no requieren autenticación.
 * Se comprueban como subcadenas del URL de la petición.
 */
const PUBLIC_URL_PATTERNS = [
  '/login',
  '/register',
  '/public',
  '/api/products', // Los productos son públicos
  '/api/categories', // Las categorías son públicas
] as const;

/**
 * Determina si una URL es pública y no requiere token.
 */
const isPublicUrl = (url: string): boolean =>
  PUBLIC_URL_PATTERNS.some(pattern => url.includes(pattern));

/**
 * Interceptor funcional para añadir token JWT a las peticiones.
 * 
 * @remarks
 * - Excluye automáticamente URLs públicas
 * - Añade el header Authorization con el Bearer token
 * - No modifica el Content-Type si ya está establecido (para FormData, etc.)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // No añadir token a rutas públicas o si no hay token
  if (!token || isPublicUrl(req.url)) {
    return next(req);
  }

  // Clonar request con headers de autenticación
  const authReq = addAuthHeader(req, token);
  return next(authReq);
};

/**
 * Añade el header de autorización a la petición.
 * Preserva el Content-Type existente para soportar FormData.
 */
const addAuthHeader = (req: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  // Solo establecer Content-Type si no está ya definido
  if (!req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/json';
  }

  return req.clone({ setHeaders: headers });
};
