import { Component, Input, Output, EventEmitter, computed, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductWithPrices, PriceComparison } from '../../shared/types';

/**
 * Componente de tarjeta de producto reutilizable.
 * Soporta dos variantes: grid (para listados) y comparison (para comparativas).
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
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

  onViewProduct(): void {
    this.viewProduct.emit(this.product);
  }
}
