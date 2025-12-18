import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [],
  templateUrl: './form-textarea.html',
  styleUrls: ['./form-textarea.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextarea),
      multi: true
    }
  ]
})
export class FormTextarea implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() helpText?: string;
  @Input() errorText?: string;
  @Input() rows = 4;
  @Input() maxLength?: number;
  @Input() resize: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get characterCount(): number {
    return this.value?.length || 0;
  }

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

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
