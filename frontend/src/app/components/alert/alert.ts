import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '../button/button';

type AlertType = 'success' | 'error' | 'warning' | 'info';

/**
 * Componente de alerta reutilizable para mostrar mensajes al usuario.
 * Soporta 4 tipos: success, error, warning, info.
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass, ButtonComponent],
  templateUrl: './alert.html',
  styleUrls: ['./alert.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Alert {
  @Input() type: AlertType = 'info';
  @Input() closeable = false;
  @Output() closed = new EventEmitter<void>();
  
  protected isVisible = signal(true);

  close(): void {
    this.isVisible.set(false);
    this.closed.emit();
  }

  protected alertClasses = computed(() => ({
    'alert': true,
    [`alert--${this.type}`]: true
  }));
}
