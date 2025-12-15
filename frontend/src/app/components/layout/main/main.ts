import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import Components
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';
import { Alert } from '../../shared/alert/alert';
import { ButtonComponent } from '../../shared/button/button';
import { FormInput } from '../../shared/form-input/form-input';
import { FormSelect, SelectOption } from '../../shared/form-select/form-select';
import { Login } from '../../shared/login/login';
import { ProductCard, Product } from '../../shared/product-card/product-card';
import { Register } from '../../shared/register/register';

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
    Login,
    ProductCard,
    Register
  ],
  templateUrl: './main.html',
  styleUrls: ['./main.sass']
})
export class Main {
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
}
