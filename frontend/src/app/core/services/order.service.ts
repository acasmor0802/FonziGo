import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: string;
  orderItems: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/orders`;

  orders = signal<Order[]>([]);
  loading = signal(false);

  async loadOrders(userId: number): Promise<void> {
    this.loading.set(true);
    try {
      const orders = await firstValueFrom(
        this.http.get<Order[]>(`${this.API_URL}/user/${userId}`)
      );
      this.orders.set(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async createOrder(userId: number): Promise<Order | null> {
    this.loading.set(true);
    try {
      const order = await firstValueFrom(
        this.http.post<Order>(`${this.API_URL}/create/${userId}`, {})
      );
      // Recargar pedidos
      await this.loadOrders(userId);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async getOrder(orderId: number): Promise<Order | null> {
    try {
      return await firstValueFrom(
        this.http.get<Order>(`${this.API_URL}/${orderId}`)
      );
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
