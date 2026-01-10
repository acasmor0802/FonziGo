import { Component, computed, signal, inject, OnInit, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpContext } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ProductCard } from '../../components/product-card/product-card';
import { environment } from '../../../environments/environment';
import { SKIP_ERROR_TOAST } from '../../core/interceptors/error.interceptor';

/** Tipo para datos de UI del supermercado */
interface SupermarketInfo {
  id: string;
  name: string;
  color: string;
  logo: string;
  slogan: string;
  backendId: number;
}

/** Producto del backend */
interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  supermarketId?: number;
  supermarketName?: string;
  rating: number;
  ratingCount: number;
  onSale: boolean;
}

/** Producto adaptado para ProductCard */
interface CardProduct {
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
  prices: CardPrice[];
}

interface CardPrice {
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
  selector: 'app-supermarket',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Header,
    Footer,
    ProductCard
  ],
  templateUrl: './supermarket.html',
  styleUrls: ['./supermarket.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupermarketPage implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private apiUrl = environment.apiUrl;

  supermarketId = signal<string>('');
  loading = signal(false);
  products = signal<CardProduct[]>([]);
  
  supermarkets: Record<string, SupermarketInfo> = {
    'mercadona': {
      id: 'mercadona',
      name: 'Mercadona',
      color: '#00a650',
      logo: 'optimized/mercadona-medium.webp',
      slogan: 'Supermercados de confianza',
      backendId: 1
    },
    'carrefour': {
      id: 'carrefour',
      name: 'Carrefour',
      color: '#004e9a',
      logo: 'optimized/carrefour-medium.webp',
      slogan: 'Mejor precio cada día',
      backendId: 2
    },
    'lidl': {
      id: 'lidl',
      name: 'Lidl',
      color: '#0050aa',
      logo: 'optimized/Lidl-medium.webp',
      slogan: 'La calidad no es cara',
      backendId: 3
    },
    'dia': {
      id: 'dia',
      name: 'Día',
      color: '#e30613',
      logo: 'optimized/dia-medium.webp',
      slogan: 'Calidad y precio',
      backendId: 4
    }
  };

  currentSupermarket = computed(() => {
    const id = this.supermarketId();
    return this.supermarkets[id] || this.supermarkets['mercadona'];
  });

  featuredProducts = computed(() => {
    return this.products().filter(p => p.prices[0]?.discount);
  });

  regularProducts = computed(() => {
    return this.products().filter(p => !p.prices[0]?.discount);
  });

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      this.supermarketId.set(params['id'] || 'mercadona');
      this.loadProducts();
    });
  }

  loadProducts(): void {
    const supermarket = this.currentSupermarket();
    this.loading.set(true);
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);

    this.http.get<{ content: BackendProduct[] }>(`${this.apiUrl}/products?supermarketId=${supermarket.backendId}&size=50`, { context }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        const backendProducts: BackendProduct[] = response.content || [];
        this.products.set(backendProducts.map(p => this.convertToCardProduct(p)));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading.set(false);
      }
    });
  }

  private convertToCardProduct(p: BackendProduct): CardProduct {
    const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : undefined;
    const supermarket = this.currentSupermarket();
    
    // Usar imagen del backend o placeholder
    const imageUrl = p.imageUrl || '';
    
    return {
      id: p.id,
      name: p.name,
      description: p.description || '',
      category: p.categoryName || 'General',
      categoryId: p.categoryId,
      categoryName: p.categoryName || 'General',
      unit: p.unit || 'unidad',
      image: imageUrl,
      imageUrl: imageUrl,
      onSale: p.onSale || !!discount,
      lowestPrice: p.price,
      highestPrice: p.originalPrice || p.price,
      rating: p.rating || 4.0,
      ratingCount: p.ratingCount || 0,
      reviews: p.ratingCount || 0,
      prices: [{
        supermarketId: supermarket.backendId,
        supermarketName: p.supermarketName || supermarket.name,
        store: p.supermarketName || supermarket.name,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: discount,
        onSale: p.onSale || !!discount,
        available: true
      }]
    };
  }
}
