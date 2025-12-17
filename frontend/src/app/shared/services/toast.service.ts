import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$: Observable<ToastMessage[]> = this.toastsSubject.asObservable();

  private defaultDurations: Record<ToastType, number> = {
    success: 3000,
    error: 5000,
    info: 4000,
    warning: 4500
  };

  constructor() {
    console.log('🍞 ToastService inicializado');
  }

  private show(type: ToastType, title: string, message?: string, customDuration?: number): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      type,
      title,
      message,
      duration: customDuration || this.defaultDurations[type],
      timestamp: new Date()
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    console.log(`🍞 Toast mostrado [${type}]:`, toast);

    // Auto-dismiss
    setTimeout(() => {
      this.dismiss(toast.id);
    }, toast.duration);
  }

  success(title: string, message?: string, duration?: number): void {
    this.show('success', title, message, duration);
  }

  error(title: string, message?: string, duration?: number): void {
    this.show('error', title, message, duration);
  }

  info(title: string, message?: string, duration?: number): void {
    this.show('info', title, message, duration);
  }

  warning(title: string, message?: string, duration?: number): void {
    this.show('warning', title, message, duration);
  }

  dismiss(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
    console.log(`🗑️ Toast eliminado: ${id}`);
  }

  dismissAll(): void {
    this.toastsSubject.next([]);
    console.log('🗑️ Todos los toasts eliminados');
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
