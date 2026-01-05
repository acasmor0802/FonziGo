import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, computed, booleanAttribute } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonVariant, ButtonSize } from '../../shared/types';

/**
 * Componente de botón reutilizable con múltiples variantes y estados.
 * 
 * @example
 * <app-button variant="primary" size="md" (clicked)="onSave()">Guardar</app-button>
 * <app-button variant="danger" [loading]="isLoading">Eliminar</app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrls: ['./button.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) fullWidth = false;
  @Input() ariaLabel?: string;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  
  @Output() clicked = new EventEmitter<Event>();

  protected buttonClasses = computed(() => ({
    'btn': true,
    [`btn--${this.variant}`]: true,
    [`btn--${this.size}`]: true,
    'btn--full': this.fullWidth,
    'btn--loading': this.loading,
    'btn--icon-left': !!(this.icon && this.iconPosition === 'left'),
    'btn--icon-right': !!(this.icon && this.iconPosition === 'right')
  }));

  protected get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  onClick(event: Event): void {
    if (!this.isDisabled) {
      this.clicked.emit(event);
    }
  }
}
