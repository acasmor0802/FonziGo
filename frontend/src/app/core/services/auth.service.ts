import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { User, LoginResponse, RegisterRequest } from '../../shared/types';

// Re-export para compatibilidad con código existente
export type { User } from '../../shared/types';

/** Claves de localStorage para persistencia */
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
} as const;

/**
 * Servicio de autenticación.
 * Gestiona login, registro, sesión y perfil de usuario.
 * Utiliza signals para estado reactivo.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Estado reactivo con signals
  readonly isLoggedIn = signal(false);
  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(false);
  
  // Computed signals para acceso rápido
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  readonly userName = computed(() => this.currentUser()?.name ?? 'Usuario');
  readonly userEmail = computed(() => this.currentUser()?.email);

  constructor() {
    this.initializeFromStorage();
  }

  /**
   * Carga la sesión desde localStorage al iniciar la aplicación.
   */
  private initializeFromStorage(): void {
    const token = this.getToken();
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.isLoggedIn.set(true);
        this.currentUser.set(user);
        // Refrescar datos del servidor en background
        this.refreshUserData();
      } catch {
        this.clearSession();
      }
    }
  }

  /**
   * Refresca los datos del usuario desde el servidor.
   */
  private async refreshUserData(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/auth/me`)
      );
      this.currentUser.set(user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // Token expirado o inválido
      this.clearSession();
    }
  }

  /**
   * Inicia sesión con email y contraseña.
   */
  async login(email: string, password: string): Promise<boolean> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      );
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
      const user = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/auth/me`)
      );
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      this.isLoggedIn.set(true);
      this.currentUser.set(user);
      return true;
    } catch (error) {
      this.handleAuthError('Login', error);
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Registra un nuevo usuario y hace login automático.
   */
  async register(email: string, password: string, name?: string): Promise<boolean> {
    this.isLoading.set(true);
    try {
      const request: RegisterRequest = {
        email,
        password,
        name: (name || email.split('@')[0]).substring(0, 35)
      };
      
      await firstValueFrom(
        this.http.post<User>(`${this.apiUrl}/auth/register`, request)
      );
      
      return this.login(email, password);
    } catch (error) {
      this.handleAuthError('Register', error);
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    this.clearSession();
  }

  /**
   * Obtiene el token JWT almacenado.
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Actualiza los datos del usuario en el estado local.
   */
  updateUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    this.currentUser.set(user);
  }

  /**
   * Actualiza el perfil del usuario en el servidor.
   */
  async updateProfile(updates: Partial<User>): Promise<boolean> {
    this.isLoading.set(true);
    try {
      const updatedUser = await firstValueFrom(
        this.http.put<User>(`${this.apiUrl}/users/me`, updates)
      );
      
      const merged = { ...this.currentUser(), ...updatedUser };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
      this.currentUser.set(merged);
      return true;
    } catch (error) {
      this.handleAuthError('UpdateProfile', error);
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Limpia la sesión del usuario.
   */
  private clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }

  /**
   * Maneja errores de autenticación de forma consistente.
   */
  private handleAuthError(operation: string, error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      console.error(`[Auth] ${operation} failed:`, error.status, error.message);
    } else {
      console.error(`[Auth] ${operation} failed:`, error);
    }
  }
}
