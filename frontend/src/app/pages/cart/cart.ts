import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CartService, CartItem, Cart } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../shared/services/toast.service';
import { ToastComponent } from '../../components/toast/toast';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Footer, ToastComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.sass'
})
export class CartPage implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  
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

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return '/assets/images/placeholder.jpg';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/api/')) {
      return `${environment.apiUrl.replace('/api', '')}${imageUrl}`;
    }
    return imageUrl;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
