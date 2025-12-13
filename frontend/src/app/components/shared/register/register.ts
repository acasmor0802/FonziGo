import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormInput } from '../form-input/form-input';
import { FormSelect, SelectOption } from '../form-select/form-select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormInput, FormSelect, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.sass']
})
export class Register {
  countryOptions: SelectOption[] = [
    { value: 'es', label: 'España' },
    { value: 'fr', label: 'Francia' },
    { value: 'it', label: 'Italia' },
    { value: 'pt', label: 'Portugal' },
    { value: 'de', label: 'Alemania' },
    { value: 'uk', label: 'Reino Unido' },
    { value: 'other', label: 'Otro' }
  ];
}
