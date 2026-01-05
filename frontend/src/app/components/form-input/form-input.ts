import { Component, Input, forwardRef, ChangeDetectionStrategy, booleanAttribute, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'search';

/**
 * Componente de input de formulario con integración de ControlValueAccessor.
 * Se integra perfectamente con ReactiveFormsModule y template-driven forms.
 */
@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [],
  templateUrl: './form-input.html',
  styleUrls: ['./form-input.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ]
})
export class FormInput implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() name = '';
  @Input() placeholder = '';
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() helpText?: string;
  @Input() errorText?: string;
  @Input() autocomplete?: string;

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

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
