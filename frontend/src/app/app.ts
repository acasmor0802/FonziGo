import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Alert } from './components/shared/alert/alert';
import { FormInput } from './components/shared/form-input/form-input';
import { ProductCard, Product } from './components/shared/product-card/product-card';
import { Login } from './components/shared/login/login';
import { Register } from './components/shared/register/register';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Alert, FormInput, ProductCard, Login, Register],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App {
  // Datos de ejemplo para product-card
  sampleProduct: Product = {
    id: '1',
    name: 'Aceite de Oliva Virgen Extra 1L',
    category: 'Aceites',
    image: 'https://via.placeholder.com/200x200?text=Aceite',
    prices: [
      { store: 'Mercadona', price: 5.99, originalPrice: 7.99, discount: 25, available: true },
      { store: 'Carrefour', price: 6.49, available: true },
      { store: 'Lidl', price: 5.49, originalPrice: 6.99, discount: 21, available: true },
      { store: 'Dia', price: 7.99, available: false }
    ],
    rating: 4.5,
    reviews: 128,
    unit: '1 Litro',
    promotion: '¡Oferta!'
  };
}
