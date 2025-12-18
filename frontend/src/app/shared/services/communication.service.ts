import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// ===== INTERFACES =====

export interface NotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  data?: any;
}

export interface SharedState {
  cartItemCount: number;
  userLoggedIn: boolean;
  currentTheme: 'light' | 'dark';
  lastActivity: Date;
}

// ===== SERVICIO =====

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  // BehaviorSubjects privados
  private notificationsSubject = new BehaviorSubject<NotificationPayload | null>(null);
  private sharedStateSubject = new BehaviorSubject<SharedState>({
    cartItemCount: 0,
    userLoggedIn: false,
    currentTheme: 'light',
    lastActivity: new Date()
  });

  // Observables públicos de solo lectura
  notifications$: Observable<NotificationPayload | null> = this.notificationsSubject.asObservable();
  sharedState$: Observable<SharedState> = this.sharedStateSubject.asObservable();

  constructor() {
    console.log('CommunicationService inicializado');
  }

  // ===== MÉTODOS DE NOTIFICACIONES =====

  sendNotification(notification: Omit<NotificationPayload, 'id' | 'timestamp'>): void {
    const fullNotification: NotificationPayload = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.notificationsSubject.next(fullNotification);
    console.log('Notificación enviada:', fullNotification);
  }

  sendInfoNotification(message: string, data?: any): void {
    this.sendNotification({ type: 'info', message, data });
  }

  sendSuccessNotification(message: string, data?: any): void {
    this.sendNotification({ type: 'success', message, data });
  }

  sendWarningNotification(message: string, data?: any): void {
    this.sendNotification({ type: 'warning', message, data });
  }

  sendErrorNotification(message: string, data?: any): void {
    this.sendNotification({ type: 'error', message, data });
  }

  clearNotifications(): void {
    this.notificationsSubject.next(null);
  }

  getNotifications$(): Observable<NotificationPayload | null> {
    return this.notifications$;
  }

  // ===== MÉTODOS DE ESTADO COMPARTIDO =====

  updateSharedState(partialState: Partial<SharedState>): void {
    const currentState = this.sharedStateSubject.value;
    const newState: SharedState = {
      ...currentState,
      ...partialState,
      lastActivity: new Date()
    };
    
    this.sharedStateSubject.next(newState);
    console.log('Estado compartido actualizado:', newState);
  }

  getSharedState$(): Observable<SharedState> {
    return this.sharedState$;
  }

  getCurrentSharedState(): SharedState {
    return this.sharedStateSubject.value;
  }

  // Métodos específicos para actualizar partes del estado
  updateCartItemCount(count: number): void {
    this.updateSharedState({ cartItemCount: count });
  }

  setUserLoggedIn(loggedIn: boolean): void {
    this.updateSharedState({ userLoggedIn: loggedIn });
  }

  setCurrentTheme(theme: 'light' | 'dark'): void {
    this.updateSharedState({ currentTheme: theme });
  }

  // ===== HELPERS =====

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
