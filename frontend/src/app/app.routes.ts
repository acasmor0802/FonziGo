import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Main } from './layout/main/main';
import { StyleGuide } from './pages/style-guide/style-guide';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'style-guide', component: StyleGuide }
];
