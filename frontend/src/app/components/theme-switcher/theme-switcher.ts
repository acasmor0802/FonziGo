import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.html',
  styleUrls: ['./theme-switcher.sass']
})
export class ThemeSwitcher implements OnInit {
  isDarkMode = signal(false);

  ngOnInit(): void {
    this.loadTheme();
  }

  private loadTheme(): void {
    // 1. Primero verificar localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // 2. Si no hay tema guardado, usar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
    
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode.update(v => !v);
    this.applyTheme();
    this.saveTheme();
  }

  private applyTheme(): void {
    const html = document.documentElement;
    
    if (this.isDarkMode()) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  }

  private saveTheme(): void {
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }
}
