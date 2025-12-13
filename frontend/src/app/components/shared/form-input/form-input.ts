import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [NgIf],
  templateUrl: './form-input.html',
  styleUrls: ['./form-input.sass']
})
export class FormInput {
  @Input() id = '';
  @Input() label = '';
  @Input() type = 'text';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() helpText?: string;
  @Input() errorText?: string;
}
