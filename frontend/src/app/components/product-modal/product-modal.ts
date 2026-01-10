import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Package } from 'lucide-angular';
import { findOptimizedImageByName } from '../../shared/utils/image.utils';

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
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product-modal.html',
  styleUrls: ['./product-modal.sass']
})
export class ProductModalComponent {
  @Input() product: ProductDetail | null = null;
  @Input() similarProducts: ProductDetail[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<ProductDetail>();
  @Output() selectProduct = new EventEmitter<ProductDetail>();
  
  // Lucide Icons
  readonly PackageIcon = Package;
  
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

  /**
   * Verifica si la cadena es solo un emoji o está vacía (no una URL de imagen)
   */
  isEmojiOnly(str: string): boolean {
    if (!str) return true;
    // Si contiene extensiones de imagen comunes, no es solo emoji
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(str)) return false;
    // Si empieza con http, /, o tiene estructura de path, es una URL
    if (str.startsWith('http') || str.startsWith('/') || str.includes('/')) return false;
    // Verificar si es solo emojis o caracteres especiales
    const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\s]+$/u;
    return emojiRegex.test(str) || str.length <= 4;
  }
  
  /**
   * Obtiene la imagen del producto usando el sistema de imágenes optimizadas
   * Prioriza imágenes locales sobre las del backend para evitar 404
   */
  getProductImage(productName: string, fallbackImage?: string): string {
    // Primero intentar encontrar imagen optimizada por nombre del producto
    const optimized = findOptimizedImageByName(productName);
    if (optimized) {
      return `optimized/${optimized}-medium.webp`;
    }
    
    // Solo usar imagen del backend si es una URL externa completa (http)
    if (fallbackImage && fallbackImage.startsWith('http') && !this.isEmojiOnly(fallbackImage)) {
      return fallbackImage;
    }
    
    // Imagen placeholder por defecto
    return 'optimized/sinFotojpg-medium.webp';
  }
  
  /**
   * Verifica si el producto tiene una imagen real (no emoji ni vacía)
   */
  hasRealImage(image: string): boolean {
    return !!image && !this.isEmojiOnly(image);
  }
}
