import { Component, OnInit, AfterViewInit, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../button/button';
import { ToastService } from '../../shared/services/toast.service';
import { AsyncValidatorsService } from '../../shared/validators/async-validators.service';
import { passwordStrength, passwordMatch, telefonoValidator } from '../../shared/validators/custom-validators';
import { AuthService } from '../../core/services/auth.service';
import { GoogleAuthService } from '../../core/services/google-auth.service';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.sass'],
  encapsulation: ViewEncapsulation.None
})
export class Register implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private asyncValidators = inject(AsyncValidatorsService);
  private authService = inject(AuthService);
  private googleAuthService = inject(GoogleAuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  submitted = signal(false);
  loading = signal(false);
  googleLoading = this.googleAuthService.loading;
  googleError = this.googleAuthService.error;

  countryOptions: SelectOption[] = [
    { value: 'ca', label: 'Cádiz' },
    { value: 'hu', label: 'Huelva' },
    { value: 'se', label: 'Sevilla' },
    { value: 'ma', label: 'Málaga' },
    { value: 'co', label: 'Córdoba' },
    { value: 'ja', label: 'Jaén' },
    { value: 'al', label: 'Almería' },
    { value: 'gr', label: 'Granada' }
  ];

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    // Inicializar el botón de Google después de que la vista esté lista
    setTimeout(() => {
      this.googleAuthService.initializeGoogleButton('google-register-button');
    }, 100);
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], [this.asyncValidators.emailUnique()]],
      phone: ['', [Validators.required, telefonoValidator()]],
      provincia: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrength()]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: [passwordMatch('password', 'confirmPassword')]
    });
  }

  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get provincia() { return this.registerForm.get('provincia'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Email inválido';
    if (errors['emailUnique']) return 'Este email ya está registrado';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['telefono']) return errors['telefono'].message;
    if (errors['passwordStrength']) {
      const ps = errors['passwordStrength'];
      if (ps.tooShort) return 'Mínimo 8 caracteres';
      if (ps.noUpperCase) return 'Debe incluir mayúsculas';
      if (ps.noLowerCase) return 'Debe incluir minúsculas';
      if (ps.noNumber) return 'Debe incluir números';
      if (ps.noSymbol) return 'Debe incluir símbolos (!@#$%...)';
    }

    return 'Campo inválido';
  }

  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  hasFormError(errorName: string): boolean {
    return this.registerForm.hasError(errorName) && !!this.confirmPassword?.touched;
  }

  isPending(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.pending);
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.toastService.error('Por favor, corrige los errores del formulario');
      return;
    }

    if (this.registerForm.pending) {
      this.toastService.info('Validando datos...');
      return;
    }

    this.loading.set(true);

    try {
      const { email, password } = this.registerForm.value;
      const success = await this.authService.register(email, password);
      
      if (success) {
        this.toastService.success('¡Cuenta creada exitosamente!');
        this.router.navigate(['/']);
      } else {
        this.toastService.error('Error al crear la cuenta');
      }
    } catch {
      this.toastService.error('Error al crear la cuenta');
    } finally {
      this.loading.set(false);
    }
  }

  registerWithGoogle(): void {
    // El botón de Google maneja esto automáticamente
    this.toastService.info('Usa el botón de Google de arriba');
  }

  registerWithApple(): void {
    this.toastService.info('Registro con Apple próximamente');
  }
}
