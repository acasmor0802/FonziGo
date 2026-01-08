import { Component, ViewChild, ElementRef, signal, computed, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Search, Apple, Milk, Beef, Croissant, Wine, Package, Snowflake, Brush, SprayCan, PawPrint, LucideIconData } from 'lucide-angular';

// Import Components
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductModalComponent, ProductDetail } from '../../components/product-modal/product-modal';
import { ToastComponent } from '../../components/toast/toast';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner';
import { ToastService } from '../../shared/services/toast.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ProductWithPrices as CardProduct, PriceComparison } from '../../shared/types';

// Mapa de iconos de Lucide para categorías por slug
const CATEGORY_ICONS: { [key: string]: LucideIconData } = {
  'frutas-verduras': Apple,
  'lacteos-huevos': Milk,
  'carnes-pescados': Beef,
  'panaderia': Croissant,
  'bebidas': Wine,
  'despensa': Package,
  'congelados': Snowflake,
  'limpieza': Brush,
  'cuidado-personal': SprayCan,
  'mascotas': PawPrint
};

/**
 * Obtiene el icono de Lucide para una categoría por su slug
 */
function getCategoryIconBySlug(slug: string): LucideIconData {
  return CATEGORY_ICONS[slug] || Apple;
}

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

interface BackendCategory {
  id: number;
  name: string;
  icon: LucideIconData;
  slug: string;
}

interface ProductsResponse {
  content: BackendProduct[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface PriceRange {
  label: string;
  min: number;
  max: number | null;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    Header,
    Footer,
    ProductCard,
    ProductModalComponent,
    ToastComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.sass']
})
export class ProductsPage implements OnInit {
  @ViewChild('categoriesList') categoriesList!: ElementRef;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private apiUrl = environment.apiUrl;
  
  // Lucide Icons
  readonly SearchIcon = Search;
  
  // Exponer Math para el template
  readonly Math = Math;

  // Loading state
  loading = signal(false);

  // Filter state
  showFilters = signal(false);
  selectedCategory = signal<number | null>(null);
  selectedPriceRange = signal<PriceRange | null>(null);
  selectedStore = signal<string | null>(null);
  searchQuery = signal('');
  sortBy = signal<'price-asc' | 'price-desc' | 'newest' | 'popular'>('popular');

  // Categorías del backend
  categories = signal<BackendCategory[]>([]);

  // Carrusel de ofertas
  offerCarouselIndex = signal(0);
  offersPerView = 4;

  // Rangos de precio
  priceRanges: PriceRange[] = [
    { label: 'Menos de 5€', min: 0, max: 5 },
    { label: '5€ - 10€', min: 5, max: 10 },
    { label: '10€ - 20€', min: 10, max: 20 },
    { label: 'Más de 20€', min: 20, max: null }
  ];

  // Tiendas
  stores = ['Mercadona', 'Carrefour', 'Lidl', 'Dia'];

  // Productos del backend
  allProducts = signal<BackendProduct[]>([]);
  offerProducts = signal<BackendProduct[]>([]);
  
  // Pagination (frontend-based)
  currentPage = signal(0);
  productsPerPage = 18; // 3 filas de 6 productos

  // Computed: filtered products para la vista
  filteredProducts = computed(() => {
    let products = [...this.allProducts()];

    // Filter by price range (frontend filter since backend doesn't have it)
    const priceRange = this.selectedPriceRange();
    if (priceRange) {
      products = products.filter(p => {
        const price = p.price || 0;
        if (priceRange.max === null) {
          return price >= priceRange.min;
        }
        return price >= priceRange.min && price < priceRange.max;
      });
    }

    // Filter by store (frontend filter)
    const store = this.selectedStore();
    if (store) {
      products = products.filter(p => p.supermarketName === store);
    }

    return products;
  });

  // Filtered offers
  filteredOfferProducts = computed(() => {
    let products = [...this.offerProducts()];

    // Filter by price range
    const priceRange = this.selectedPriceRange();
    if (priceRange) {
      products = products.filter(p => {
        const price = p.price || 0;
        if (priceRange.max === null) {
          return price >= priceRange.min;
        }
        return price >= priceRange.min && price < priceRange.max;
      });
    }

    // Filter by store
    const store = this.selectedStore();
    if (store) {
      products = products.filter(p => p.supermarketName === store);
    }

    return products;
  });

  // Sorted products
  sortedProducts = computed(() => {
    let products = [...this.filteredProducts()];
    const sort = this.sortBy();
    
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }
    return products;
  });

  sortedOfferProducts = computed(() => {
    let products = [...this.filteredOfferProducts()];
    const sort = this.sortBy();
    
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }
    return products;
  });

  // Productos paginados para mostrar en la vista
  paginatedProducts = computed(() => {
    const all = this.sortedProducts();
    const start = this.currentPage() * this.productsPerPage;
    return all.slice(start, start + this.productsPerPage);
  });

  // Total de páginas calculado sobre productos filtrados
  computedTotalPages = computed(() => {
    const total = this.sortedProducts().length;
    return Math.ceil(total / this.productsPerPage);
  });

  // Conversion for card component - ahora usa paginatedProducts
  cardProducts = computed(() => this.paginatedProducts().map(p => this.convertToCardProduct(p)));
  cardOfferProducts = computed(() => this.sortedOfferProducts().map(p => this.convertToCardProduct(p)));
  
  // Ofertas visibles en el carrusel (máximo 4)
  visibleOffers = computed(() => {
    const all = this.cardOfferProducts();
    const start = this.offerCarouselIndex();
    return all.slice(start, start + this.offersPerView);
  });
  
  // Total pages array for pagination - usa computedTotalPages
  pagesArray = computed(() => 
    Array.from({ length: this.computedTotalPages() }, (_, i) => i)
  );
  
  // Si hay más ofertas para mostrar
  hasMoreOffers = computed(() => {
    return this.cardOfferProducts().length > this.offersPerView;
  });
  
  canGoNext = computed(() => {
    return this.offerCarouselIndex() + this.offersPerView < this.cardOfferProducts().length;
  });
  
  canGoPrev = computed(() => {
    return this.offerCarouselIndex() > 0;
  });

  ngOnInit(): void {
    // Load categories
    this.loadCategories();
    
    // Subscribe to query params for category filter
    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      const categoryName = params['categoria'];
      if (categoryName) {
        // Find category by name
        const category = this.categories().find(c => c.name === categoryName);
        if (category) {
          this.selectedCategory.set(category.id);
        }
      }
      this.loadProducts();
      this.loadOfferProducts();
    });
  }

  loadCategories(): void {
    this.http.get<BackendCategory[]>(`${this.apiUrl}/categories`).subscribe({
      next: (categories) => {
        // Mapear iconos SVG por slug
        const mappedCategories = categories.map(cat => ({
          ...cat,
          icon: getCategoryIconBySlug(cat.slug)
        }));
        this.categories.set(mappedCategories);
        // Check if we need to set category from URL after loading
        const categoryName = this.route.snapshot.queryParams['categoria'];
        if (categoryName) {
          const category = categories.find(c => c.name === categoryName);
          if (category) {
            this.selectedCategory.set(category.id);
            this.loadProducts();
            this.loadOfferProducts();
          }
        }
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    
    // Cargar TODOS los productos para filtrar/paginar en frontend
    let params = new HttpParams()
      .set('page', '0')
      .set('size', '1000'); // Cargar todos

    const categoryId = this.selectedCategory();
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    const search = this.searchQuery();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params }).subscribe({
      next: (response) => {
        this.allProducts.set(response.content);
        // Reset a página 0 cuando se cargan nuevos productos
        this.currentPage.set(0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading.set(false);
      }
    });
  }

  loadOfferProducts(): void {
    let params = new HttpParams()
      .set('page', '0')
      .set('size', '10')
      .set('onSale', 'true');

    const categoryId = this.selectedCategory();
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    const search = this.searchQuery();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params }).subscribe({
      next: (response) => {
        this.offerProducts.set(response.content);
      },
      error: (err) => console.error('Error loading offers:', err)
    });
  }

  // Filter methods
  toggleFilters(): void {
    this.showFilters.update(v => !v);
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(0);
    this.loadProducts();
    this.loadOfferProducts();
  }

  selectCategoryByName(categoryName: string): void {
    const category = this.categories().find(c => c.name === categoryName);
    if (category) {
      this.selectCategory(category.id);
    } else {
      this.selectCategory(null);
    }
  }

  selectPriceRange(range: PriceRange | null): void {
    this.selectedPriceRange.set(range);
    this.currentPage.set(0); // Reset a página 0 al filtrar
  }

  selectStore(store: string | null): void {
    this.selectedStore.set(store);
    this.currentPage.set(0); // Reset a página 0 al filtrar
  }

  // Carrusel de ofertas
  nextOffers(): void {
    if (this.canGoNext()) {
      this.offerCarouselIndex.update(i => i + 1);
    }
  }

  prevOffers(): void {
    if (this.canGoPrev()) {
      this.offerCarouselIndex.update(i => i - 1);
    }
  }

  clearFilters(): void {
    this.selectedCategory.set(null);
    this.selectedPriceRange.set(null);
    this.selectedStore.set(null);
    this.searchQuery.set('');
    this.currentPage.set(0);
    this.loadProducts();
    this.loadOfferProducts();
  }

  hasActiveFilters(): boolean {
    return this.selectedCategory() !== null || 
           this.selectedPriceRange() !== null || 
           this.selectedStore() !== null ||
           this.searchQuery() !== '';
  }

  goToPage(page: number): void {
    const maxPage = this.computedTotalPages();
    if (page >= 0 && page < maxPage) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollCategories(): void {
    if (this.categoriesList) {
      this.categoriesList.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  searchProducts(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(0);
    this.loadProducts();
    this.loadOfferProducts();
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy.set(select.value as 'price-asc' | 'price-desc' | 'newest' | 'popular');
    this.currentPage.set(0); // Solo reset página, el ordenamiento es en frontend
  }

  // =====================================
  // Product Modal
  // =====================================
  selectedProduct = signal<ProductDetail | null>(null);
  
  similarProducts = computed<ProductDetail[]>(() => {
    const current = this.selectedProduct();
    if (!current) return [];
    
    const similar = this.allProducts()
      .filter(p => p.categoryName === current.category && p.id.toString() !== current.id)
      .slice(0, 4)
      .map(p => this.convertToProductDetail(p));
    
    return similar;
  });

  openProductModal(product: CardProduct): void {
    // Find the backend product by ID
    const productId = product.id;
    const backendProduct = this.allProducts().find(p => p.id === productId) ||
                          this.offerProducts().find(p => p.id === productId);
    
    if (backendProduct) {
      const detail = this.convertToProductDetail(backendProduct);
      this.selectedProduct.set(detail);
      document.body.style.overflow = 'hidden';
    }
  }

  closeProductModal(): void {
    this.selectedProduct.set(null);
    document.body.style.overflow = '';
  }

  onSelectSimilarProduct(product: ProductDetail): void {
    this.selectedProduct.set(product);
  }

  async onAddToCart(product: ProductDetail): Promise<void> {
    // Verificar si el usuario está logueado
    if (!this.authService.isLoggedIn()) {
      this.toastService.warning('Inicia sesión para añadir productos al carrito');
      return;
    }
    
    try {
      const success = await this.cartService.addToCart(Number(product.id), 1);
      if (success) {
        this.toastService.success(`${product.name} añadido al carrito`);
      } else {
        this.toastService.error('Error al añadir al carrito');
      }
    } catch (err: unknown) {
      this.toastService.error('Error al añadir al carrito');
    }
  }

  // =====================================
  // Conversion helpers
  // =====================================
  private convertToCardProduct(product: BackendProduct): CardProduct {
    const discount = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : undefined;

    const price: PriceComparison = {
      supermarketId: product.supermarketId || 0,
      supermarketName: product.supermarketName || 'Tienda',
      store: product.supermarketName || 'Tienda',
      price: product.price,
      originalPrice: product.originalPrice,
      discount: discount,
      onSale: product.onSale || !!discount,
      available: true
    };

    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      category: product.categoryName,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      unit: product.unit || 'unidad',
      image: this.getImageUrl(product.imageUrl),
      imageUrl: this.getImageUrl(product.imageUrl),
      onSale: product.onSale || !!discount,
      lowestPrice: product.price,
      highestPrice: product.originalPrice || product.price,
      rating: product.rating || 4.0,
      ratingCount: product.ratingCount || 0,
      reviews: product.ratingCount,
      prices: [price]
    };
  }

  private convertToProductDetail(product: BackendProduct): ProductDetail {
    const discount = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : undefined;

    return {
      id: product.id.toString(),
      name: product.name,
      store: product.supermarketName || 'Tienda',
      image: this.getImageUrl(product.imageUrl),
      price: product.price,
      originalPrice: product.originalPrice,
      discount: discount,
      rating: product.rating || 4.5,
      totalRatings: product.ratingCount || 0,
      unit: product.unit || 'unidad',
      category: product.categoryName
    };
  }

  private getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return '/assets/images/placeholder.jpg';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/api/')) {
      return `${environment.apiUrl.replace('/api', '')}${imageUrl}`;
    }
    // Use emoji as fallback
    return imageUrl;
  }
}
