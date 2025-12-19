import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Login } from '../../components/login/login';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [Header, Footer, Login],
  template: `
    <app-header></app-header>
    <main class="page-content">
      <div class="page-content__container">
        <app-login></app-login>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .page-content
      min-height: calc(100vh - 200px)
      display: flex
      align-items: center
      justify-content: center
      padding: var(--spacing-8) var(--spacing-4)
      background-color: var(--background)
    
    .page-content__container
      width: 100%
      max-width: 550px
  `]
})
export class LoginPage {}
