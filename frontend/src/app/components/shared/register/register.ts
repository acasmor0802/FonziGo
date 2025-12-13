import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormInput } from '../form-input/form-input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormInput, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.sass']
})
export class Register {}
