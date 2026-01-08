import { Component, OnInit, signal, computed, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Sun, Moon, ShoppingCart } from 'lucide-angular';
import { ButtonComponent } from '../../components/button/button';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ButtonComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.sass'],
  encapsulation: ViewEncapsulation.None // Estilos globales desde 05-components/_header.sass
})
export class Header implements OnInit {
  private auth = inject(AuthService);
  private cartService = inject(CartService);
  
  // Lucide Icons
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly CartIcon = ShoppingCart;
  
  isDarkMode = signal(false);
  isMobileMenuOpen = signal(false);
  isLoggedIn = this.auth.isLoggedIn;
  currentUser = this.auth.currentUser;
  cartItemCount = this.cartService.itemCount;
  
  themeLabel = computed(() => 
    this.isDarkMode() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  );
  
  userPhoto = computed(() => {
    const user = this.currentUser();
    return user?.avatarUrl || 'sinFotojpg.jpg';
  });

  private readonly THEME_KEY = 'theme';
  private readonly DARK_MODE_CLASS = 'dark-mode';

  ngOnInit(): void {
    this.initializeTheme();
    // Cargar carrito si el usuario está logueado
    if (this.isLoggedIn()) {
      this.cartService.loadCart();
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(value => !value);
    this.persistTheme();
    this.applyTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const initialValue = savedTheme ? savedTheme === 'dark' : this.getSystemPreference();
    this.isDarkMode.set(initialValue);
    this.applyTheme();
  }

  private getSystemPreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private persistTheme(): void {
    const themeValue = this.isDarkMode() ? 'dark' : 'light';
    localStorage.setItem(this.THEME_KEY, themeValue);
  }

  private applyTheme(): void {
    this.updateDOMTheme();
  }

  private updateDOMTheme(): void {
    const root = document.documentElement;
    const isDark = this.isDarkMode();
    root.style.colorScheme = isDark ? 'dark' : 'light';
    root.classList.toggle(this.DARK_MODE_CLASS, isDark);
  }
  
  logout(): void {
    this.auth.logout();
    this.closeMobileMenu();
  }
}
