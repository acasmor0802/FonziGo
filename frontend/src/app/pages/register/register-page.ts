import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Register } from '../../components/register/register';

/**
 * RegisterPage - Página de registro con layout completo
 * 
 * Esta página actúa como wrapper que incluye:
 * - Header con navegación y theme switcher
 * - Componente Register (formulario reactivo con validadores)
 * - Footer
 * 
 * Sigue el patrón de separación entre:
 * - Páginas (layout/routing)
 * - Componentes (lógica/presentación)
 */
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, Header, Footer, Register],
  template: `
    <div class="page-wrapper">
      <app-header />
      <main class="page-content">
        <div class="auth-container">
          <app-register />
        </div>
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    .page-wrapper
      min-height: 100vh
      display: flex
      flex-direction: column
      background-color: var(--bg-primary)

    .page-content
      flex: 1
      display: flex
      align-items: center
      justify-content: center
      padding: var(--spacing-8) var(--spacing-4)

    .auth-container
      width: 100%
      max-width: 480px
  `]
})
export class RegisterPage {}
