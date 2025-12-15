import { Component, Input, computed, signal } from '@angular/core';
import { ButtonComponent } from '../button/button';

export interface PriceComparison {
  store: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  prices: PriceComparison[];
  rating?: number;
  reviews?: number;
  unit?: string;
  promotion?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.sass']
})
export class ProductCard {
  @Input() product!: Product;
  @Input() variant: 'grid' | 'comparison' = 'grid';

  bestPrice = computed(() => {
    const available = this.product?.prices?.filter(p => p.available) ?? [];
    return available.length > 0 
      ? available.reduce((min, p) => p.price < min.price ? p : min)
      : null;
  });

  savingsAmount = computed(() => {
    const best = this.bestPrice();
    if (!best?.discount || !best.originalPrice) return 0;
    return best.originalPrice - best.price;
  });

  readonly Math = Math;
}
