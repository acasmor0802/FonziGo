import { Component, ViewChild, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Import Components
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Alert } from '../../components/alert/alert';
import { ButtonComponent } from '../../components/button/button';
import { FormInput } from '../../components/form-input/form-input';
import { FormSelect, SelectOption } from '../../components/form-select/form-select';
import { FormTextarea } from '../../components/form-textarea/form-textarea';
import { Login } from '../../components/login/login';
import { ProductCard, Product } from '../../components/product-card/product-card';
import { Register } from '../../components/register/register';

// Import interactive demo components
import { DynamicDemoComponent } from '../../components/dynamic-demo/dynamic-demo';
import { EventDemoComponent } from '../../components/event-demo/event-demo';
import { ModalComponent } from '../../components/modal/modal';
import { TabsComponent } from '../../components/tabs/tabs';
import { TooltipComponent } from '../../components/tooltip/tooltip';
import { AccordionComponent } from '../../components/accordion/accordion';

// Import form components
import { InvoiceFormComponent } from '../../components/invoice-form/invoice-form';
import { ContactFormComponent } from '../../components/contact-form/contact-form';

// Import global UI components
import { ToastComponent } from '../../components/toast/toast';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner';

// Import services
import { ToastService } from '../../shared/services/toast.service';
import { LoadingService } from '../../shared/services/loading.service';
import { CommunicationService } from '../../shared/services/communication.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Header,
    Footer,
    Alert,
    ButtonComponent,
    FormInput,
    FormSelect,
    FormTextarea,
    Login,
    ProductCard,
    Register,
    DynamicDemoComponent,
    EventDemoComponent,
    ModalComponent,
    TabsComponent,
    TooltipComponent,
    AccordionComponent,
    InvoiceFormComponent,
    ContactFormComponent,
    ToastComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './main.html',
  styleUrls: ['./main.sass']
})
export class Main implements OnInit, OnDestroy {
  @ViewChild('demoModal') demoModal!: ModalComponent;

  // Inyección moderna de servicios
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private communicationService = inject(CommunicationService);

  // Subject para gestionar suscripciones
  private destroy$ = new Subject<void>();

  // --- Data for Components ---

  // For app-form-select
  selectOptions: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ];

  // For app-product-card - 6 products
  sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Aceite de Oliva Virgen Extra 1L',
      category: 'Alimentación',
      image: 'https://via.placeholder.com/180',
      prices: [
        { store: 'Mercadona', price: 4.99, available: true, originalPrice: 6.99, discount: 29 },
        { store: 'Carrefour', price: 5.50, available: true }
      ],
      rating: 4.5,
      reviews: 230
    },
    {
      id: '2',
      name: 'Leche Entera 6 Unidades',
      category: 'Lácteos',
      image: 'https://via.placeholder.com/180',
      prices: [
        { store: 'Lidl', price: 3.20, available: true, originalPrice: 3.99, discount: 20 },
        { store: 'Mercadona', price: 3.45, available: true }
      ],
      rating: 4.8,
      reviews: 450
    },
    {
      id: '3',
      name: 'Arroz Integral 1Kg',
      category: 'Alimentación',
      image: 'https://via.placeholder.com/180',
      prices: [
        { store: 'Aldi', price: 1.89, available: true },
        { store: 'Carrefour', price: 2.10, available: true }
      ],
      rating: 4.2,
      reviews: 120
    },
    {
      id: '4',
      name: 'Pasta Italiana 500g',
      category: 'Alimentación',
      image: 'https://via.placeholder.com/180',
      prices: [
        { store: 'Mercadona', price: 0.99, available: true, originalPrice: 1.49, discount: 34 },
        { store: 'Lidl', price: 1.05, available: true }
      ],
      rating: 4.6,
      reviews: 340
    },
    {
      id: '5',
      name: 'Café Molido Natural 250g',
      category: 'Bebidas',
      image: 'https://via.placeholder.com/180',
      prices: [
        { store: 'Carrefour', price: 3.50, available: true },
        { store: 'Mercadona', price: 3.75, available: true }
      ],
      rating: 4.7,
      reviews: 280
    },
    {
      id: '6',
      name: 'Detergente Líquido 3L',
      category: 'Limpieza',
      image: 'https://via.placeholder.com/180',
      prices: [
        { store: 'Lidl', price: 5.99, available: true, originalPrice: 7.99, discount: 25 },
        { store: 'Aldi', price: 6.20, available: true }
      ],
      rating: 4.4,
      reviews: 190
    }
  ];

  ngOnInit(): void {
    // Escuchar notificaciones globales
    this.communicationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        if (notification) {
          console.log('Notificación recibida:', notification);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal(): void {
    this.demoModal.open();
  }

  // Métodos para demostrar servicios
  showSuccessToast(): void {
    this.toastService.success('¡Operación realizada correctamente!');
  }

  showErrorToast(): void {
    this.toastService.error('Ha ocurrido un error inesperado');
  }

  showInfoToast(): void {
    this.toastService.info('Información importante para el usuario');
  }

  showWarningToast(): void {
    this.toastService.warning('Atención: Esta acción no se puede deshacer');
  }

  simulateLoading(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
      this.toastService.success('Carga completada');
    }, 2000);
  }
}
