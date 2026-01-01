import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorsService {
  // Simular base de datos de usuarios existentes
  private existingEmails = [
    'test@example.com',
    'user@test.com',
    'admin@fonzigo.com'
  ];

  private existingUsernames = [
    'admin',
    'testuser',
    'johndoe'
  ];

  /**
   * Valida si un email ya está registrado
   * Simula una llamada a API con debounce
   */
  emailUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(500).pipe(
        switchMap(() => {
          return this.checkEmailExists(control.value);
        }),
        map(exists => {
          if (exists) {
            return {
              emailUnique: {
                message: 'Este email ya está registrado',
                value: control.value
              }
            };
          }
          return null;
        }),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Valida si un nombre de usuario ya existe
   * Simula una llamada a API con debounce
   */
  usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(500).pipe(
        switchMap(() => {
          return this.checkUsernameExists(control.value);
        }),
        map(exists => {
          if (exists) {
            return {
              usernameAvailable: {
                message: 'Este nombre de usuario no está disponible',
                value: control.value
              }
            };
          }
          return null;
        }),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Validador de NIF que verifica contra API externa (simulado)
   */
  nifExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(700).pipe(
        switchMap(() => {
          return this.checkNifInDatabase(control.value);
        }),
        map(exists => {
          if (!exists) {
            return {
              nifExists: {
                message: 'NIF no encontrado en la base de datos',
                value: control.value
              }
            };
          }
          return null;
        }),
        catchError(() => of(null))
      );
    };
  }

  private checkEmailExists(email: string): Observable<boolean> {
    const exists = this.existingEmails.includes(email.toLowerCase());
    return of(exists);
  }

  private checkUsernameExists(username: string): Observable<boolean> {
    const exists = this.existingUsernames.includes(username.toLowerCase());
    return of(exists);
  }

  private checkNifInDatabase(nif: string): Observable<boolean> {
    const validNifs = ['12345678A', '87654321B', '11111111H'];
    const exists = validNifs.includes(nif);
    return of(exists);
  }
}

export function emailUniqueValidator(service: AsyncValidatorsService): AsyncValidatorFn {
  return service.emailUnique();
}

export function usernameAvailableValidator(service: AsyncValidatorsService): AsyncValidatorFn {
  return service.usernameAvailable();
}
