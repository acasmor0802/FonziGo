import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators,
  AbstractControl
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { telefonoValidator, nifValidator } from '../../shared/validators/custom-validators';
import { AsyncValidatorsService } from '../../shared/validators/async-validators.service';
import { ToastService } from '../../shared/services/toast.service';

interface FormStatus {
  submitted: boolean;
  loading: boolean;
  success: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.sass']
})
export class ContactFormComponent implements OnInit, OnDestroy {
  // Inyección moderna con inject()
  private fb = inject(FormBuilder);
  private asyncValidators = inject(AsyncValidatorsService);
  private toastService = inject(ToastService);

  // Subject para gestionar suscripciones
  private destroy$ = new Subject<void>();

  // Estado del formulario con signals
  formStatus = signal<FormStatus>({
    submitted: false,
    loading: false,
    success: false
  });

  // Formulario reactivo
  contactForm!: FormGroup;

  // Opciones para el select
  subjectOptions: SelectOption[] = [
    { value: 'general', label: 'Consulta General' },
    { value: 'support', label: 'Soporte Técnico' },
    { value: 'sales', label: 'Ventas' },
    { value: 'feedback', label: 'Sugerencias' },
    { value: 'complaint', label: 'Reclamación' }
  ];

  priorityOptions: SelectOption[] = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      // Datos personales
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ], [
        // Validador asíncrono - verificar email único
        this.asyncValidators.emailUnique()
      ]],
      telefono: ['', [
        Validators.required,
        telefonoValidator()
      ]],
      nif: ['', [
        nifValidator()
      ]],

      // Datos del mensaje
      asunto: ['', Validators.required],
      prioridad: ['medium', Validators.required],
      mensaje: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],

      // Consentimientos
      aceptaTerminos: [false, Validators.requiredTrue],
      aceptaNewsletter: [false]
    });
  }

  private setupFormListeners(): void {
    // Escuchar cambios en el formulario para debugging
    this.contactForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        console.log('📋 Form status:', status);
      });

    // Escuchar cuando el email termina de validarse
    this.email?.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (status === 'PENDING') {
          console.log('⏳ Validando email...');
        }
      });
  }

  // Getters para acceso fácil a los controles
  get nombre(): AbstractControl | null {
    return this.contactForm.get('nombre');
  }

  get email(): AbstractControl | null {
    return this.contactForm.get('email');
  }

  get telefono(): AbstractControl | null {
    return this.contactForm.get('telefono');
  }

  get nif(): AbstractControl | null {
    return this.contactForm.get('nif');
  }

  get asunto(): AbstractControl | null {
    return this.contactForm.get('asunto');
  }

  get prioridad(): AbstractControl | null {
    return this.contactForm.get('prioridad');
  }

  get mensaje(): AbstractControl | null {
    return this.contactForm.get('mensaje');
  }

  get aceptaTerminos(): AbstractControl | null {
    return this.contactForm.get('aceptaTerminos');
  }

  // Métodos de utilidad para mensajes de error
  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['email']) return 'Email inválido';
    if (errors['emailUnique']) return 'Este email ya está registrado';
    if (errors['telefono']) return errors['telefono'].message;
    if (errors['nif']) return errors['nif'].message;

    return 'Campo inválido';
  }

  hasError(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isPending(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control && control.pending);
  }

  // Envío del formulario
  async onSubmit(): Promise<void> {
    this.formStatus.update(s => ({ ...s, submitted: true }));

    // Marcar todos los campos como touched para mostrar errores
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      this.toastService.error('Por favor, corrige los errores del formulario');
      console.error('❌ Formulario inválido:', this.contactForm.errors);
      return;
    }

    // Si hay validaciones async pendientes, esperar
    if (this.contactForm.pending) {
      this.toastService.info('Validando datos, por favor espera...');
      return;
    }

    this.formStatus.update(s => ({ ...s, loading: true }));

    try {
      // Simular envío al servidor
      await this.simulateSubmit();

      this.formStatus.update(s => ({ ...s, success: true, loading: false }));
      this.toastService.success('¡Mensaje enviado correctamente!');
      console.log('✅ Formulario enviado:', this.contactForm.value);

      // Resetear formulario después de éxito
      this.contactForm.reset({
        prioridad: 'medium',
        aceptaTerminos: false,
        aceptaNewsletter: false
      });
      this.formStatus.update(s => ({ ...s, submitted: false }));

    } catch (error) {
      this.formStatus.update(s => ({ ...s, loading: false }));
      this.toastService.error('Error al enviar el mensaje. Inténtalo de nuevo.');
      console.error('❌ Error al enviar:', error);
    }
  }

  private simulateSubmit(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  // Método para resetear el formulario
  resetForm(): void {
    this.contactForm.reset({
      prioridad: 'medium',
      aceptaTerminos: false,
      aceptaNewsletter: false
    });
    this.formStatus.set({
      submitted: false,
      loading: false,
      success: false
    });
  }
}
