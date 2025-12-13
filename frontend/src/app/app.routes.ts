import { Routes } from '@angular/router';
import { Login } from './components/shared/login/login';
import { Register } from './components/shared/register/register';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '', pathMatch: 'full', children: [] }
];
