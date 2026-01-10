import { Component, OnInit, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../button/button';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { GoogleAuthService } from '../../core/services/google-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.sass']
})
export class Login implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private googleAuthService = inject(GoogleAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  submitted = signal(false);
  loading = signal(false);
  googleLoading = this.googleAuthService.loading;
  googleError = this.googleAuthService.error;

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    // Inicializar el botón de Google después de que la vista esté lista
    setTimeout(() => {
      this.googleAuthService.initializeGoogleButton('google-signin-button');
    }, 100);
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

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
      const { email, password } = this.loginForm.value;
      const success = await this.authService.login(email, password);
      
      if (success) {
        this.toastService.success('¡Inicio de sesión exitoso!');
        // Redirigir a returnUrl si existe, sino a inicio
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.toastService.error('Credenciales incorrectas');
      }
    } catch {
      this.toastService.error('Error al iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }

  loginWithGoogle(): void {
    // El botón de Google maneja esto automáticamente
    this.toastService.info('Usa el botón de Google de arriba');
  }

  loginWithApple(): void {
    this.toastService.info('Login con Apple próximamente');
  }
}
