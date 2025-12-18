import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { RegisterPage } from './pages/register/register-page';
import { Main } from './layout/main/main';
import { StyleGuide } from './pages/style-guide/style-guide';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'style-guide', component: StyleGuide }
];
