import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import all UI components
import { ButtonComponent } from '../../components/button/button';
import { Alert } from '../../components/alert/alert';
import { FormInput } from '../../components/form-input/form-input';
import { FormSelect, SelectOption } from '../../components/form-select/form-select';
import { ProductCard, Product } from '../../components/product-card/product-card';
import { Footer } from '../../layout/footer/footer';

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

  sampleProduct: Product = {
    id: '1',
    name: 'Producto de Ejemplo',
    category: 'Categoría',
    image: 'https://placehold.co/300x200/333F51/FFF1D5?text=Producto',
    prices: [
      { store: 'Tienda A', price: 29.99, available: true },
      { store: 'Tienda B', price: 32.50, available: true }
    ]
  };

  // Button variants and sizes for iteration
  buttonVariants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
  buttonSizes = ['sm', 'md', 'lg'] as const;

  // Alert types
  alertTypes = ['success', 'error', 'warning', 'info'] as const;

  // Console log for button clicks
  onButtonClick(variant: string, size: string): void {
    console.log(`Button clicked: ${variant} - ${size}`);
  }
}
