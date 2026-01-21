import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams, HttpContext } from '@angular/common/http';
import { Observable, tap, catchError, of, firstValueFrom, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Product, Category, ProductsResponse, ProductFilters } from '../../shared/types';
import { SKIP_ERROR_TOAST } from '../interceptors/error.interceptor';

// Re-exports para compatibilidad
export type { Product, Category, ProductsResponse } from '../../shared/types';

/** Valores por defecto para paginación */
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 0;

/**
 * Servicio de productos.
 * Gestiona el catálogo de productos con filtros, búsqueda y paginación.
 * Utiliza signals para estado reactivo.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Estado reactivo con signals
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly selectedCategory = signal<number | null>(null);
  readonly searchQuery = signal('');
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly totalElements = signal(0);

  // Computed signals
  readonly hasMore = computed(() => this.currentPage() < this.totalPages() - 1);
  readonly isEmpty = computed(() => !this.loading() && this.products().length === 0);

  /**
   * Carga productos con filtros opcionales.
   */
  loadProducts(
    page = DEFAULT_PAGE,
    size = DEFAULT_PAGE_SIZE,
    categoryId?: number,
    search?: string
  ): Observable<ProductsResponse> {
    this.loading.set(true);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);

    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params, context }).pipe(
      tap(response => {
        this.products.set(response.content);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.currentPage.set(response.number);
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('[ProductService] Error loading products:', error);
        this.loading.set(false);
        return of(this.emptyResponse());
      })
    );
  }

  /**
   * Carga las categorías disponibles.
   */
  loadCategories(): Observable<Category[]> {
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);

    return this.http.get<Category[]>(`${this.apiUrl}/categories`, { context }).pipe(
      tap(categories => this.categories.set(categories)),
      catchError(error => {
        console.error('[ProductService] Error loading categories:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene un producto por su ID.
   */
  getProductById(id: number): Observable<Product | null> {
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);

    return this.http.get<Product>(`${this.apiUrl}/products/${id}`, { context }).pipe(
      catchError(error => {
        console.error(`[ProductService] Error loading product ${id}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Filtra productos por categoría.
   */
  async filterByCategory(categoryId: number | null): Promise<void> {
    this.selectedCategory.set(categoryId);
    await firstValueFrom(
      this.loadProducts(DEFAULT_PAGE, DEFAULT_PAGE_SIZE, categoryId ?? undefined, this.searchQuery() || undefined)
    );
  }

  /**
   * Busca productos por texto.
   */
  async search(query: string): Promise<void> {
    this.searchQuery.set(query);
    const categoryId = this.selectedCategory();
    await firstValueFrom(
      this.loadProducts(DEFAULT_PAGE, DEFAULT_PAGE_SIZE, categoryId ?? undefined, query || undefined)
    );
  }

  /**
   * Carga más productos (scroll infinito).
   */
  async loadMore(): Promise<void> {
    if (!this.hasMore() || this.loading()) return;

    const nextPage = this.currentPage() + 1;
    const categoryId = this.selectedCategory();
    const search = this.searchQuery();

    this.loading.set(true);

    let params = new HttpParams()
      .set('page', nextPage.toString())
      .set('size', DEFAULT_PAGE_SIZE.toString());

    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);

    try {
      const response = await firstValueFrom(
        this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params, context }).pipe(
          catchError(error => {
            console.error('[ProductService] Error loading more products:', error);
            return throwError(() => error);
          })
        )
      );

      if (response) {
        this.products.update(current => [...current, ...response.content]);
        this.currentPage.set(response.number);
      }
    } catch (error) {
      // Error ya manejado en catchError
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Obtiene productos en oferta.
   */
  getProductsOnSale(): Observable<ProductsResponse> {
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);

    return this.http.get<ProductsResponse>(`${this.apiUrl}/products?onSale=true`, { context }).pipe(
      catchError(error => {
        console.error('[ProductService] Error loading sale products:', error);
        return of(this.emptyResponse());
      })
    );
  }

  /**
   * Construye la URL completa de una imagen de producto.
   */
  getImageUrl(imagePath: string | undefined | null): string {
    if (!imagePath) {
      return '/assets/images/placeholder.jpg';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/api/')) {
      return `${environment.apiUrl.replace('/api', '')}${imagePath}`;
    }
    return imagePath;
  }

  /**
   * Genera una respuesta vacía para manejo de errores.
   */
  private emptyResponse(): ProductsResponse {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: DEFAULT_PAGE_SIZE,
      number: 0,
      first: true,
      last: true,
      empty: true
    };
  }
}
