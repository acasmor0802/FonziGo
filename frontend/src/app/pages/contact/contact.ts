import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ButtonComponent } from '../../components/button/button';
import { ToastComponent } from '../../components/toast/toast';
import { ToastService } from '../../shared/services/toast.service';
import { telefonoValidator } from '../../shared/validators/custom-validators';

interface ContactInfo {
  icon: string;
  title: string;
  content: string;
  link?: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    Footer,
    ButtonComponent,
    ToastComponent
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.sass'
})
export class ContactPage {
  contactForm: FormGroup;
  isSubmitting = signal(false);

  contactInfo: ContactInfo[] = [
    {
      icon: '📧',
      title: 'Email',
      content: 'acasmor@gmail.com',
      link: 'mailto:acasmor@gmail.com'
    },
    {
      icon: '📱',
      title: 'Teléfono',
      content: '+34 600 000 000',
      link: 'tel:+34600000000'
    },
    {
      icon: '📍',
      title: 'Dirección',
      content: 'C. Amiel, s/n, 11012 Barriada de la Paz, Cádiz'
    },
    {
      icon: '⏰',
      title: 'Horario',
      content: 'Lun - Vie: 9:00 - 18:00'
    }
  ];

  faqs: FAQ[] = [
    {
      question: '¿Cómo puedo crear una cuenta?',
      answer: 'Puedes crear una cuenta haciendo clic en "Registrarse" en la esquina superior derecha. Solo necesitas tu email y una contraseña.',
      isOpen: false
    },
    {
      question: '¿Es gratis usar FonziGo?',
      answer: 'Sí, FonziGo es completamente gratis para los compradores. Comparamos precios de múltiples tiendas para ayudarte a encontrar las mejores ofertas.',
      isOpen: false
    },
    {
      question: '¿Cómo funcionan las alertas de precio?',
      answer: 'Puedes configurar alertas para cualquier producto. Te notificaremos por email cuando el precio baje al nivel que hayas indicado.',
      isOpen: false
    },
    {
      question: '¿Puedo añadir mi tienda a FonziGo?',
      answer: 'Sí, aceptamos tiendas de todo tipo. Contáctanos a través del formulario y te explicaremos el proceso de integración.',
      isOpen: false
    }
  ];

  subjects = [
    'Consulta general',
    'Soporte técnico',
    'Añadir mi tienda',
    'Reportar un problema',
    'Sugerencias',
    'Otro'
  ];

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [telefonoValidator()]],
      subject: ['Consulta general', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.toastService.success('¡Mensaje enviado!', 'Te responderemos lo antes posible.');
    this.contactForm.reset({ subject: 'Consulta general' });
    this.isSubmitting.set(false);
  }

  getError(field: string): string | null {
    const control = this.contactForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['email']) return 'Email no válido';
      if (control.errors['minlength']) {
        const minLength = control.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        const maxLength = control.errors['maxlength'].requiredLength;
        return `Máximo ${maxLength} caracteres`;
      }
      if (control.errors['telefonoInvalido']) return 'Teléfono no válido';
    }
    return null;
  }
}
