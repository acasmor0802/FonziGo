import { Component } from '@angular/core';
import { Login } from '../../shared/login/login';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Login],
  templateUrl: './main.html',
  styleUrls: ['./main.sass']
})
export class Main {}
