import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, retry, timer } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Número de reintentos para peticiones GET fallidas */
const RETRY_COUNT = 2;
/** Delay entre reintentos en ms */
const RETRY_DELAY = 1000;

/**
 * Servicio base para llamadas a la API.
 * Proporciona métodos genéricos para operaciones CRUD.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * GET request genérico.
   * Incluye retry automático para errores de red (máx 2 reintentos).
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params })
      .pipe(
        retry({
          count: RETRY_COUNT,
          delay: (error, retryCount) => {
            // Solo reintentar en errores de red (0) o servidor (5xx)
            if (error.status === 0 || error.status >= 500) {
              console.warn(`[ApiService] Retry ${retryCount}/${RETRY_COUNT} for ${endpoint}`);
              return timer(RETRY_DELAY * retryCount);
            }
            // No reintentar errores 4xx (cliente)
            return throwError(() => error);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * POST request genérico.
   */
  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT request genérico.
   */
  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * PATCH request genérico.
   */
  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE request genérico.
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Maneja errores HTTP de forma consistente.
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    console.error('[ApiService]', errorMessage);
    return throwError(() => error);
  };
}
