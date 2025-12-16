import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Main } from './layout/main/main';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];
