import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductDetail {
  id: string;
  name: string;
  store: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  totalRatings: number;
  unit: string;
  description?: string;
  category: string;
}

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-modal.html',
  styleUrls: ['./product-modal.sass']
})
export class ProductModalComponent {
  @Input() product: ProductDetail | null = null;
  @Input() similarProducts: ProductDetail[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<ProductDetail>();
  @Output() selectProduct = new EventEmitter<ProductDetail>();
  
  userRating = signal(0);
  hoverRating = signal(0);
  
  readonly Math = Math;

  get displayRating(): number {
    return this.hoverRating() || this.userRating() || 0;
  }

  setHoverRating(rating: number): void {
    this.hoverRating.set(rating);
  }

  clearHoverRating(): void {
    this.hoverRating.set(0);
  }

  setUserRating(rating: number): void {
    this.userRating.set(rating);
  }

  onAddToCart(): void {
    if (this.product) {
      this.addToCart.emit(this.product);
    }
  }

  onSelectSimilar(product: ProductDetail): void {
    this.selectProduct.emit(product);
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('product-modal')) {
      this.onClose();
    }
  }
}
