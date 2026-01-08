import { Injectable, inject, signal, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService, User } from './auth.service';

declare const google: any;

export interface GoogleAuthResponse {
  token: string;
  expiresIn: number;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Reemplaza con tu Client ID de Google Cloud Console
  private readonly GOOGLE_CLIENT_ID = environment.googleClientId;

  loading = signal(false);
  error = signal<string | null>(null);

  /**
   * Inicializa el botón de Google Sign-In
   * @param buttonId ID del elemento HTML donde renderizar el botón
   */
  initializeGoogleButton(buttonId: string): void {
    // Esperar a que el elemento esté disponible
    setTimeout(() => {
      if (typeof google === 'undefined') {
        console.error('Google Identity Services no está cargado');
        this.error.set('Error: Google Identity Services no está disponible');
        return;
      }

      const buttonElement = document.getElementById(buttonId);
      if (!buttonElement) {
        console.error(`Elemento con ID "${buttonId}" no encontrado`);
        return;
      }

      try {
        google.accounts.id.initialize({
          client_id: this.GOOGLE_CLIENT_ID,
          callback: (response: any) => this.handleCredentialResponse(response),
          auto_select: false,
          cancel_on_tap_outside: true
        });

        google.accounts.id.renderButton(
          buttonElement,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 300
          }
        );
      } catch (err) {
        console.error('Error al inicializar botón de Google:', err);
        this.error.set('Error al cargar el botón de Google');
      }
    }, 100);
  }

  /**
   * Maneja la respuesta del login de Google
   */
  private handleCredentialResponse(response: any): void {
    this.ngZone.run(async () => {
      if (response.credential) {
        await this.authenticateWithBackend(response.credential);
      }
    });
  }

  /**
   * Envía el token de Google al backend para autenticación
   */
  private async authenticateWithBackend(credential: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        this.http.post<GoogleAuthResponse>(`${environment.apiUrl}/auth/google`, {
          credential
        })
      );

      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        
        const user = await firstValueFrom(
          this.http.get<User>(`${environment.apiUrl}/auth/me`, {
            headers: { 'Authorization': `Bearer ${response.token}` }
          })
        );
        
        localStorage.setItem('auth_user', JSON.stringify(user));
        this.authService.isLoggedIn.set(true);
        this.authService.currentUser.set(user);
        
        this.router.navigate(['/productos']);
      } else {
        console.error('Respuesta sin token:', response);
        this.error.set('Error: No se recibió token del servidor');
      }
    } catch (err: any) {
      console.error('Error en autenticación con Google:', err);
      const errorMsg = err?.error?.message || err?.message || 'Error desconocido';
      this.error.set(`Error al iniciar sesión con Google: ${errorMsg}`);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Muestra el popup de One Tap de Google
   */
  showOneTap(): void {
    if (typeof google !== 'undefined' && this.GOOGLE_CLIENT_ID) {
      google.accounts.id.prompt();
    }
  }
}
