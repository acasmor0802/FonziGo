import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  themeIcon = '🌙';
  themeLabel = 'Cambiar a modo oscuro';

  private readonly THEME_KEY = 'theme';
  private readonly DARK_MODE_CLASS = 'dark-mode';

  ngOnInit(): void {
    this.initializeTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.persistTheme();
    this.applyTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);

    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = this.getSystemPreference();
    }

    this.applyTheme();
  }

  private getSystemPreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private persistTheme(): void {
    const themeValue = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem(this.THEME_KEY, themeValue);
  }

  private applyTheme(): void {
    this.updateUI();
    this.updateDOMTheme();
  }

  private updateDOMTheme(): void {
    const root = document.documentElement;
    root.style.colorScheme = this.isDarkMode ? 'dark' : 'light';

    if (this.isDarkMode) {
      root.classList.add(this.DARK_MODE_CLASS);
    } else {
      root.classList.remove(this.DARK_MODE_CLASS);
    }
  }

  private updateUI(): void {
    this.themeIcon = this.isDarkMode ? '☀️' : '🌙';
    this.themeLabel = this.isDarkMode
      ? 'Cambiar a modo claro'
      : 'Cambiar a modo oscuro';
  }
}
