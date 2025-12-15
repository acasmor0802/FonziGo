import { Routes } from '@angular/router';
import { Login } from './components/shared/login/login';
import { Register } from './components/shared/register/register';
import { Main } from './components/layout/main/main';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];
