import { Component, Input, forwardRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './form-select.html',
  styleUrls: ['./form-select.sass'],
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
  @Input() required = false;
  @Input() disabled = false;
  @Input() helpText?: string;
  @Input() errorText?: string;
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Selecciona una opción';

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
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

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
