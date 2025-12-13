import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormInput } from '../form-input/form-input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormInput, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.sass']
})
export class Login {}
