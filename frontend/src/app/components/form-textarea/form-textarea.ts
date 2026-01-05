import { Component, Input, forwardRef, ChangeDetectionStrategy, booleanAttribute, signal, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type ResizeOption = 'none' | 'vertical' | 'horizontal' | 'both';

/**
 * Componente de textarea de formulario con integración de ControlValueAccessor.
 * Incluye contador de caracteres opcional y control de resize.
 */
@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [],
  templateUrl: './form-textarea.html',
  styleUrls: ['./form-textarea.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() helpText?: string;
  @Input() errorText?: string;
  @Input() rows = 4;
  @Input() maxLength?: number;
  @Input() resize: ResizeOption = 'vertical';

  protected value = signal('');
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected characterCount = computed(() => this.value()?.length || 0);

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
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
