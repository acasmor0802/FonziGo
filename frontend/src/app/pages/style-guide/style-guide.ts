import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import all UI components
import { ButtonComponent } from '../../components/button/button';
import { Alert } from '../../components/alert/alert';
import { FormInput } from '../../components/form-input/form-input';
import { FormSelect, SelectOption } from '../../components/form-select/form-select';
import { ProductCard } from '../../components/product-card/product-card';
import { Footer } from '../../layout/footer/footer';

/** Tipo simplificado para datos de ejemplo en la guía de estilos */
interface DemoProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryId: number;
  categoryName: string;
  unit: string;
  image: string;
  imageUrl: string;
  onSale: boolean;
  lowestPrice: number;
  highestPrice: number;
  rating: number;
  ratingCount: number;
  reviews?: number;
  prices: DemoPrice[];
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
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    Alert,
    FormInput,
    FormSelect,
    ProductCard,
    Footer
  ],
  templateUrl: './style-guide.html',
  styleUrls: ['./style-guide.sass']
})
export class StyleGuide {
  // Sample data for components
  selectOptions: SelectOption[] = [
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' },
    { value: '3', label: 'Opción 3', disabled: true },
    { value: '4', label: 'Opción 4' }
  ];

  sampleProduct: DemoProduct = {
    id: 1,
    name: 'Producto de Ejemplo',
    description: 'Descripción del producto de ejemplo',
    category: 'Categoría',
    categoryId: 1,
    categoryName: 'Categoría',
    unit: 'unidad',
    image: 'https://placehold.co/300x200/333F51/FFF1D5?text=Producto',
    imageUrl: 'https://placehold.co/300x200/333F51/FFF1D5?text=Producto',
    onSale: true,
    lowestPrice: 29.99,
    highestPrice: 32.50,
    rating: 4.5,
    ratingCount: 120,
    reviews: 120,
    prices: [
      { supermarketId: 1, supermarketName: 'Tienda A', store: 'Tienda A', price: 29.99, available: true, onSale: false },
      { supermarketId: 2, supermarketName: 'Tienda B', store: 'Tienda B', price: 32.50, available: true, onSale: false }
    ]
  };

  // Button variants and sizes for iteration
  buttonVariants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
  buttonSizes = ['sm', 'md', 'lg'] as const;

  // Alert types
  alertTypes = ['success', 'error', 'warning', 'info'] as const;

  // Handler for button click demo (intentionally empty for demo purposes)
  onButtonClick(_variant: string, _size: string): void {
    // Demo handler - no action needed
  }
}
