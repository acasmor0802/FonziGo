import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-form-select',
  imports: [NgIf, NgFor],
  templateUrl: './form-select.html',
  styleUrl: './form-select.sass',
})
export class FormSelect {
  @Input() id = '';
  @Input() label = '';
  @Input() name = '';
  @Input() required = false;
  @Input() helpText?: string;
  @Input() errorText?: string;
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Selecciona una opción';
}
