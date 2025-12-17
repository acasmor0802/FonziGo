import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../shared/services/toast.service';
import { AsyncValidatorsService } from '../../shared/validators/async-validators.service';
import { passwordStrength, passwordMatch, telefonoValidator } from '../../shared/validators/custom-validators';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.sass']
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private asyncValidators = inject(AsyncValidatorsService);

  registerForm!: FormGroup;
  submitted = signal(false);
  loading = signal(false);

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

  private initForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ], [
        this.asyncValidators.emailUnique()
      ]],
      phone: ['', [
        Validators.required,
        telefonoValidator()
      ]],
      provincia: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordStrength()
      ]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: [passwordMatch('password', 'confirmPassword')]
    });
  }

  // Getters
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
      await this.simulateRegister();
      this.toastService.success('¡Cuenta creada exitosamente!');
      console.log('✅ Register:', this.registerForm.value);
    } catch (error) {
      this.toastService.error('Error al crear la cuenta');
    } finally {
      this.loading.set(false);
    }
  }

  private simulateRegister(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }

  registerWithGoogle(): void {
    this.toastService.info('Redirigiendo a Google...');
  }

  registerWithApple(): void {
    this.toastService.info('Redirigiendo a Apple...');
  }
}
