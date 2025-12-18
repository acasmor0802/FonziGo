import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.sass']
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  loginForm!: FormGroup;
  submitted = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
  }

  // Getters para acceso fácil
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;

    return 'Campo inválido';
  }

  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.toastService.error('Por favor, corrige los errores del formulario');
      return;
    }

    this.loading.set(true);

    try {
      // Simular login
      await this.simulateLogin();
      this.toastService.success('¡Inicio de sesión exitoso!');
      console.log('Login:', this.loginForm.value);
    } catch (error) {
      this.toastService.error('Error al iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }

  private simulateLogin(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }

  loginWithGoogle(): void {
    this.toastService.info('Redirigiendo a Google...');
    console.log('Login con Google');
  }

  loginWithApple(): void {
    this.toastService.info('Redirigiendo a Apple...');
    console.log('Login con Apple');
  }
}
