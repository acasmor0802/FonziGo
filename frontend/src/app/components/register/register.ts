import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormInput } from '../form-input/form-input';
import { FormSelect, SelectOption } from '../form-select/form-select';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormInput, FormSelect, ButtonComponent, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.sass']
})
export class Register {
  countryOptions: SelectOption[] = [
    { value: 'ca', label: 'Cadiz' },
    { value: 'hu', label: 'Huelva' },
    { value: 'se', label: 'Sevilla' },
    { value: 'ma', label: 'Malaga' },
    { value: 'co', label: 'Cordoba' },
    { value: 'ja', label: 'Jaen' },
    { value: 'al', label: 'Almeria' },
    { value: 'ba', label: 'Granada' }
  ];
}
