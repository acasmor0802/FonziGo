import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrls: ['./button.sass']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  
  @Output() clicked = new EventEmitter<Event>();

  get buttonClasses(): { [key: string]: boolean } {
    return {
      'btn': true,
      [`btn--${this.variant}`]: true,
      [`btn--${this.size}`]: true,
      'btn--full': this.fullWidth,
      'btn--loading': this.loading,
      'btn--icon-left': !!(this.icon && this.iconPosition === 'left'),
      'btn--icon-right': !!(this.icon && this.iconPosition === 'right')
    };
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  onClick(event: Event): void {
    if (!this.isDisabled) {
      this.clicked.emit(event);
    }
  }
}
