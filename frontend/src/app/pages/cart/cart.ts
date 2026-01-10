import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpContext } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Lock, Clock, ShoppingCart, Home, Truck, Trash2 } from 'lucide-angular';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CartService, CartItem, Cart } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../shared/services/toast.service';
import { ToastComponent } from '../../components/toast/toast';
import { environment } from '../../../environments/environment';
import { findOptimizedImageByName } from '../../shared/utils/image.utils';
import { SKIP_ERROR_TOAST } from '../../core/interceptors/error.interceptor';

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  supermarketName: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, Header, Footer, ToastComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPage implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private apiUrl = environment.apiUrl;
  
  // Lucide Icons
  readonly LockIcon = Lock;
  readonly ClockIcon = Clock;
  readonly CartIcon = ShoppingCart;
  readonly HomeIcon = Home;
  readonly TruckIcon = Truck;
  readonly TrashIcon = Trash2;
  
  // Mapa de logos de supermercados
  private readonly storeLogos: { [key: string]: string } = {
    'Mercadona': 'optimized/mercadona-small.webp',
    'Carrefour': 'optimized/carrefour-small.webp',
    'Lidl': 'optimized/Lidl-small.webp',
    'Dia': 'optimized/dia-small.webp',
    'Día': 'optimized/dia-small.webp'
  };
  
  // Productos recomendados
  recommendedProducts = signal<RecommendedProduct[]>([]);
  
  // Estado de checkout
  checkoutLoading = signal(false);

  // Estado del carrito desde el servicio
  loading = computed(() => this.cartService.loading());
  cartItems = computed(() => this.cartService.items());
  itemCount = computed(() => this.cartService.itemCount());
  subtotal = computed(() => this.cartService.subtotal());
  
  // Computed values locales
  savings = computed(() => 
    this.cartItems().reduce((sum, item) => {
      if (item.originalPrice) {
        return sum + ((item.originalPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0)
  );
  
  deliveryFee = computed(() => this.subtotal() >= 30 ? 0 : 2.99);
  
  total = computed(() => this.subtotal() + this.deliveryFee());
  
  // Agrupar por tienda
  itemsByStore = computed(() => {
    const groups: { [store: string]: CartItem[] } = {};
    this.cartItems().forEach(item => {
      const store = item.supermarketName || 'Tienda';
      if (!groups[store]) {
        groups[store] = [];
      }
      groups[store].push(item);
    });
    return Object.entries(groups);
  });

  ngOnInit(): void {
    // Solo cargar carrito si el usuario está autenticado
    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart();
    }
    // Cargar productos recomendados
    this.loadRecommendedProducts();
  }

  loadRecommendedProducts(): void {
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);
    this.http.get<any>(`${this.apiUrl}/products?size=4&onSale=true`, { context }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        const products = response.content || [];
        this.recommendedProducts.set(products.slice(0, 4).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          imageUrl: this.getImageUrl(p.imageUrl, p.name),
          supermarketName: p.supermarketName || 'Tienda'
        })));
      },
      error: (err) => console.error('Error loading recommendations:', err)
    });
  }

  async addRecommendation(product: RecommendedProduct): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.toastService.warning('Inicia sesión para añadir productos');
      return;
    }
    
    const success = await this.cartService.addToCart(product.id, 1);
    if (success) {
      this.toastService.success(`${product.name} añadido al carrito`);
    } else {
      this.toastService.error('Error al añadir producto');
    }
  }

  async updateQuantity(itemId: number, newQuantity: number): Promise<void> {
    if (newQuantity < 1) {
      await this.removeItem(itemId);
      return;
    }
    
    const success = await this.cartService.updateQuantity(itemId, newQuantity);
    if (!success) {
      this.toastService.error('Error al actualizar cantidad');
    }
  }

  async removeItem(itemId: number): Promise<void> {
    const success = await this.cartService.removeItem(itemId);
    if (success) {
      this.toastService.success('Producto eliminado del carrito');
    } else {
      this.toastService.error('Error al eliminar producto');
    }
  }

  async clearCart(): Promise<void> {
    const success = await this.cartService.clearCart();
    if (success) {
      this.toastService.success('Carrito vaciado');
    } else {
      this.toastService.error('Error al vaciar carrito');
    }
  }

  continueShopping(): void {
    this.router.navigate(['/productos']);
  }

  checkout(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.warning('Inicia sesión para continuar con el pago');
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.cartItems().length === 0) {
      this.toastService.warning('Tu carrito está vacío');
      return;
    }
    
    this.processOrder();
  }
  
  async processOrder(): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;
    
    this.checkoutLoading.set(true);
    
    try {
      const order = await this.orderService.createOrder(user.id);
      
      if (order) {
        // Limpiar el carrito después de crear el pedido
        await this.cartService.clearCart();
        
        this.toastService.success('¡Pedido realizado con éxito!');
        
        // Redirigir al perfil para ver el historial
        this.router.navigate(['/perfil']);
      } else {
        this.toastService.error('Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      this.toastService.error('Error al procesar el pedido');
    } finally {
      this.checkoutLoading.set(false);
    }
  }

  getImageUrl(imageUrl: string, productName?: string): string {
    // Si hay imagen válida del backend
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Si hay nombre de producto, intentar buscar imagen optimizada
    if (productName) {
      const optimized = findOptimizedImageByName(productName);
      if (optimized) {
        return `optimized/${optimized}-medium.webp`;
      }
    }
    
    // Imagen placeholder por defecto
    return 'optimized/sinFotojpg-medium.webp';
  }

  getStoreLogo(storeName: string): string {
    return this.storeLogos[storeName] || '';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
