import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.sass']
})
export class Header implements OnInit {
  isDarkMode = signal(false);
  isMobileMenuOpen = signal(false);
  
  themeLabel = computed(() => 
    this.isDarkMode() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  );

  private readonly THEME_KEY = 'theme';
  private readonly DARK_MODE_CLASS = 'dark-mode';

  ngOnInit(): void {
    this.initializeTheme();
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
}
