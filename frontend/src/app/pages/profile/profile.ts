import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';
import { OrderService, Order } from '../../core/services/order.service';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

interface Purchase {
  id: string;
  date: Date;
  store: string;
  total: number;
  items: PurchaseItem[];
}

interface PurchaseItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.sass'
})
export class ProfilePage implements OnInit {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  
  user = signal<User | null>(null);
  isEditing = signal(false);
  editName = signal('');
  selectedPurchase = signal<Purchase | null>(null);
  
  // Pedidos del backend
  backendOrders = this.orderService.orders;
  ordersLoading = this.orderService.loading;
  
  // Convertir pedidos del backend al formato de Purchase
  purchases = computed<Purchase[]>(() => {
    const orders = this.backendOrders();
    if (orders.length === 0) {
      return [];
    }
    
    return orders.map(order => {
      // Calcular total sumando precio * cantidad de cada item
      const total = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        id: order.id.toString(),
        date: new Date(order.orderDate),
        store: 'FonziGo',
        total: total,
        items: order.orderItems.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price
        }))
      };
    });
  });
  
  ngOnInit(): void {
    const currentUser = this.auth.currentUser();
    this.user.set(currentUser);
    if (currentUser) {
      this.editName.set(currentUser.name);
      // Cargar pedidos del usuario
      this.orderService.loadOrders(currentUser.id);
    }
    
    // Si no está logueado, redirigir
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
  
  toggleEdit(): void {
    this.isEditing.update(v => !v);
    if (!this.isEditing()) {
      // Guardar cambios en backend
      const currentUser = this.user();
      if (currentUser) {
        const newName = this.editName();
        this.auth.updateProfile({ name: newName }).then(success => {
          if (success) {
            currentUser.name = newName;
            this.user.set({...currentUser});
          }
        });
      }
    }
  }
  
  cancelEdit(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.editName.set(currentUser.name);
    }
    this.isEditing.set(false);
  }
  
  onFileSelected(event: Event): void {
    console.log('onFileSelected triggered');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      console.log('File selected:', file.name, 'Size:', file.size);
      
      // Comprimir imagen antes de enviar
      this.compressImage(file, 200, 0.8).then(async (compressedBase64) => {
        console.log('Compressed image length:', compressedBase64.length);
        const currentUser = this.user();
        if (currentUser) {
          console.log('Calling updateProfile with avatar...');
          const success = await this.auth.updateProfile({ avatarUrl: compressedBase64 });
          console.log('updateProfile result:', success);
          if (success) {
            currentUser.avatarUrl = compressedBase64;
            this.user.set({...currentUser});
          } else {
            alert('Error al guardar la imagen. Inténtalo de nuevo.');
          }
        }
      }).catch(error => {
        console.error('Error compressing image:', error);
        alert('Error procesando la imagen.');
      });
    } else {
      console.log('No file selected');
    }
  }
  
  private compressImage(file: File, maxSize: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar si es mayor que maxSize
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
  
  selectPurchase(purchase: Purchase): void {
    this.selectedPurchase.set(purchase);
  }
  
  closePurchaseDetail(): void {
    this.selectedPurchase.set(null);
  }
  
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
  
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  }
}
