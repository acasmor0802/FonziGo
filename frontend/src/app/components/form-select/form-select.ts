import { Component, Input, forwardRef, ChangeDetectionStrategy, booleanAttribute, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Componente de select de formulario con integración de ControlValueAccessor.
 * Se integra perfectamente con ReactiveFormsModule y template-driven forms.
 */
@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [],
  templateUrl: './form-select.html',
  styleUrls: ['./form-select.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelect),
      multi: true
    }
  ]
})
export class FormSelect implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() name = '';
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() helpText?: string;
  @Input() errorText?: string;
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Selecciona una opción';

  protected value = signal('');
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
