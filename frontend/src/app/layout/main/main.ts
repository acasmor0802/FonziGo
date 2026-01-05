import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import Components
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Alert } from '../../components/alert/alert';
import { ButtonComponent } from '../../components/button/button';
import { FormInput } from '../../components/form-input/form-input';
import { FormSelect, SelectOption } from '../../components/form-select/form-select';
import { FormTextarea } from '../../components/form-textarea/form-textarea';
import { Login } from '../../components/login/login';
import { ProductCard } from '../../components/product-card/product-card';
import { Register } from '../../components/register/register';
import { ToastComponent } from '../../components/toast/toast';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner';
import { ModalComponent } from '../../components/modal/modal';
import { ToastService } from '../../shared/services/toast.service';

/** Tipo simplificado para datos de ejemplo en la demostración */
interface DemoProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  imageUrl: string;
  description: string;
  unit: string;
  categoryId: number;
  categoryName: string;
  rating: number;
  ratingCount: number;
  reviews?: number;
  onSale: boolean;
  prices: DemoPrice[];
  lowestPrice: number;
  highestPrice: number;
}

interface DemoPrice {
  supermarketId: number;
  supermarketName: string;
  store: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  onSale: boolean;
  available: boolean;
}

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
    ToastComponent,
    LoadingSpinnerComponent,
    ModalComponent
  ],
  templateUrl: './main.html',
  styleUrls: ['./main.sass']
})
export class Main {
  @ViewChild('demoModal') demoModal!: ModalComponent;

  constructor(private toastService: ToastService) {}

  openModal(): void {
    this.demoModal.open();
  }

  showToast(type: 'success' | 'error' | 'info' | 'warning'): void {
    const messages = {
      success: { title: '¡Éxito!', message: 'La operación se completó correctamente.' },
      error: { title: 'Error', message: 'Ha ocurrido un error inesperado.' },
      info: { title: 'Información', message: 'Este es un mensaje informativo.' },
      warning: { title: 'Advertencia', message: 'Ten cuidado con esta acción.' }
    };
    const { title, message } = messages[type];
    this.toastService[type](title, message);
  }

  // --- Data for Components ---

  // For app-form-select
  selectOptions: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ];

  // For app-product-card - 6 products (datos de demostración)
  sampleProducts: DemoProduct[] = [
    {
      id: 1,
      name: 'Aceite de Oliva Virgen Extra 1L',
      description: 'Aceite de oliva virgen extra de primera prensada',
      category: 'Alimentación',
      categoryId: 1,
      categoryName: 'Alimentación',
      unit: 'L',
      image: 'https://via.placeholder.com/180',
      imageUrl: 'https://via.placeholder.com/180',
      onSale: true,
      lowestPrice: 4.99,
      highestPrice: 5.50,
      prices: [
        { supermarketId: 1, supermarketName: 'Mercadona', store: 'Mercadona', price: 4.99, available: true, originalPrice: 6.99, discount: 29, onSale: true },
        { supermarketId: 2, supermarketName: 'Carrefour', store: 'Carrefour', price: 5.50, available: true, onSale: false }
      ],
      rating: 4.5,
      ratingCount: 230,
      reviews: 230
    },
    {
      id: 2,
      name: 'Leche Entera 6 Unidades',
      description: 'Pack de 6 botellas de leche entera',
      category: 'Lácteos',
      categoryId: 2,
      categoryName: 'Lácteos',
      unit: 'pack',
      image: 'https://via.placeholder.com/180',
      imageUrl: 'https://via.placeholder.com/180',
      onSale: true,
      lowestPrice: 3.20,
      highestPrice: 3.45,
      prices: [
        { supermarketId: 3, supermarketName: 'Lidl', store: 'Lidl', price: 3.20, available: true, originalPrice: 3.99, discount: 20, onSale: true },
        { supermarketId: 1, supermarketName: 'Mercadona', store: 'Mercadona', price: 3.45, available: true, onSale: false }
      ],
      rating: 4.8,
      ratingCount: 450,
      reviews: 450
    },
    {
      id: 3,
      name: 'Arroz Integral 1Kg',
      description: 'Arroz integral de grano largo',
      category: 'Alimentación',
      categoryId: 1,
      categoryName: 'Alimentación',
      unit: 'Kg',
      image: 'https://via.placeholder.com/180',
      imageUrl: 'https://via.placeholder.com/180',
      onSale: false,
      lowestPrice: 1.89,
      highestPrice: 2.10,
      prices: [
        { supermarketId: 4, supermarketName: 'Aldi', store: 'Aldi', price: 1.89, available: true, onSale: false },
        { supermarketId: 2, supermarketName: 'Carrefour', store: 'Carrefour', price: 2.10, available: true, onSale: false }
      ],
      rating: 4.2,
      ratingCount: 120,
      reviews: 120
    },
    {
      id: 4,
      name: 'Pasta Italiana 500g',
      description: 'Pasta italiana de trigo duro',
      category: 'Alimentación',
      categoryId: 1,
      categoryName: 'Alimentación',
      unit: 'g',
      image: 'https://via.placeholder.com/180',
      imageUrl: 'https://via.placeholder.com/180',
      onSale: true,
      lowestPrice: 0.99,
      highestPrice: 1.05,
      prices: [
        { supermarketId: 1, supermarketName: 'Mercadona', store: 'Mercadona', price: 0.99, available: true, originalPrice: 1.49, discount: 34, onSale: true },
        { supermarketId: 3, supermarketName: 'Lidl', store: 'Lidl', price: 1.05, available: true, onSale: false }
      ],
      rating: 4.6,
      ratingCount: 340,
      reviews: 340
    },
    {
      id: 5,
      name: 'Café Molido Natural 250g',
      description: 'Café molido natural 100% arábica',
      category: 'Bebidas',
      categoryId: 5,
      categoryName: 'Bebidas',
      unit: 'g',
      image: 'https://via.placeholder.com/180',
      imageUrl: 'https://via.placeholder.com/180',
      onSale: false,
      lowestPrice: 3.50,
      highestPrice: 3.75,
      prices: [
        { supermarketId: 2, supermarketName: 'Carrefour', store: 'Carrefour', price: 3.50, available: true, onSale: false },
        { supermarketId: 1, supermarketName: 'Mercadona', store: 'Mercadona', price: 3.75, available: true, onSale: false }
      ],
      rating: 4.7,
      ratingCount: 280,
      reviews: 280
    },
    {
      id: 6,
      name: 'Detergente Líquido 3L',
      description: 'Detergente líquido para ropa de color',
      category: 'Limpieza',
      categoryId: 6,
      categoryName: 'Limpieza',
      unit: 'L',
      image: 'https://via.placeholder.com/180',
      imageUrl: 'https://via.placeholder.com/180',
      onSale: true,
      lowestPrice: 5.99,
      highestPrice: 6.20,
      prices: [
        { supermarketId: 3, supermarketName: 'Lidl', store: 'Lidl', price: 5.99, available: true, originalPrice: 7.99, discount: 25, onSale: true },
        { supermarketId: 4, supermarketName: 'Aldi', store: 'Aldi', price: 6.20, available: true, onSale: false }
      ],
      rating: 4.4,
      ratingCount: 190,
      reviews: 190
    }
  ];
}
