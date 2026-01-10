import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SKIP_ERROR_TOAST } from '../interceptors/error.interceptor';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  unit: string;
  supermarketName: string;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/cart`;

  cart = signal<Cart | null>(null);
  loading = signal(false);
  
  itemCount = computed(() => this.cart()?.itemCount || 0);
  subtotal = computed(() => this.cart()?.subtotal || 0);
  items = computed(() => this.cart()?.items || []);

  async loadCart(): Promise<void> {
    this.loading.set(true);
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);
    try {
      const cart = await firstValueFrom(
        this.http.get<Cart>(this.API_URL, { context })
      );
      this.cart.set(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      this.cart.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  async addToCart(productId: number, quantity: number = 1): Promise<boolean> {
    this.loading.set(true);
    try {
      const cart = await firstValueFrom(
        this.http.post<Cart>(`${this.API_URL}/add`, { productId, quantity })
      );
      this.cart.set(cart);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async updateQuantity(cartItemId: number, quantity: number): Promise<boolean> {
    // No mostrar loading para actualizaciones rápidas (evita re-render)
    try {
      const cart = await firstValueFrom(
        this.http.put<Cart>(`${this.API_URL}/items/${cartItemId}`, { quantity })
      );
      this.cart.set(cart);
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
  }

  async removeItem(cartItemId: number): Promise<boolean> {
    // No mostrar loading para eliminaciones (evita re-render)
    try {
      const cart = await firstValueFrom(
        this.http.delete<Cart>(`${this.API_URL}/items/${cartItemId}`)
      );
      this.cart.set(cart);
      return true;
    } catch (error) {
      console.error('Error removing cart item:', error);
      return false;
    }
  }

  async clearCart(): Promise<boolean> {
    this.loading.set(true);
    try {
      const cart = await firstValueFrom(
        this.http.delete<Cart>(`${this.API_URL}/clear`)
      );
      this.cart.set(cart);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  // For users not logged in - local storage cart
  getLocalCart(): CartItem[] {
    const cartJson = localStorage.getItem('local_cart');
    return cartJson ? JSON.parse(cartJson) : [];
  }

  setLocalCart(items: CartItem[]): void {
    localStorage.setItem('local_cart', JSON.stringify(items));
  }
}
