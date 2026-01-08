import { Component, Input, Output, EventEmitter, computed, ChangeDetectionStrategy } from '@angular/core';
import { ProductWithPrices, PriceComparison } from '../../shared/types';
import { generateSizes, findOptimizedImageByName } from '../../shared/utils/image.utils';

/**
 * Componente de tarjeta de producto reutilizable.
 * Soporta dos variantes: grid (para listados) y comparison (para comparativas).
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  @Input({ required: true }) product!: ProductWithPrices;
  @Input() variant: 'grid' | 'comparison' = 'grid';
  @Output() viewProduct = new EventEmitter<ProductWithPrices>();

  /**
   * Calcula el mejor precio disponible del producto.
   */
  bestPrice = computed((): PriceComparison | null => {
    const prices = this.product?.prices;
    if (!prices?.length) return null;
    
    const available = prices.filter(p => p.available);
    if (!available.length) return null;
    
    return available.reduce((min, p) => p.price < min.price ? p : min);
  });

  /**
   * Calcula el ahorro respecto al precio original.
   */
  savingsAmount = computed((): number => {
    const best = this.bestPrice();
    if (!best?.originalPrice) return 0;
    return best.originalPrice - best.price;
  });

  /**
   * Referencia a Math para usar en el template.
   */
  protected readonly Math = Math;

  /**
   * Obtiene la imagen optimizada basada en el nombre del producto.
   */
  private optimizedImageName = computed(() => {
    const product = this.product;
    if (!product?.name) return null;
    return findOptimizedImageByName(product.name);
  });

  /**
   * Genera srcset para la imagen del producto.
   */
  imageSrcset = computed(() => {
    const optimized = this.optimizedImageName();
    if (optimized) {
      return `optimized/${optimized}-small.webp 400w, optimized/${optimized}-medium.webp 800w, optimized/${optimized}-large.webp 1200w`;
    }
    return '';
  });

  /**
   * Genera sizes para la imagen del producto.
   */
  imageSizes = generateSizes('card');

  /**
   * Genera src fallback (tamaño medium o placeholder).
   */
  imageSrc = computed(() => {
    const optimized = this.optimizedImageName();
    if (optimized) {
      return `optimized/${optimized}-medium.webp`;
    }
    return 'optimized/sinFotojpg-medium.webp';
  });

  onViewProduct(): void {
    this.viewProduct.emit(this.product);
  }
}
