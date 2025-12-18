import { Component, OnInit, AfterViewInit, signal, computed, ViewEncapsulation, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.sass'],
  encapsulation: ViewEncapsulation.None // Estilos globales desde 05-components/_header.sass
})
export class Header implements OnInit, AfterViewInit {
  @ViewChild('mobileMenu', { read: ElementRef }) mobileMenuRef!: ElementRef;
  @ViewChild('hamburgerButton', { read: ElementRef }) hamburgerButtonRef!: ElementRef;

  isDarkMode = signal(false);
  isMobileMenuOpen = signal(false);
  
  themeLabel = computed(() => 
    this.isDarkMode() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  );

  private readonly THEME_KEY = 'theme';
  private readonly DARK_MODE_CLASS = 'dark-mode';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initializeTheme();
    console.log('Tema aplicado al iniciar:', this.isDarkMode() ? 'oscuro' : 'claro');
  }

  ngAfterViewInit(): void {
    // Verificar acceso al DOM
    console.log('✓ ViewChild - Menú móvil:', this.mobileMenuRef?.nativeElement);
    console.log('✓ ViewChild - Botón hamburguesa:', this.hamburgerButtonRef?.nativeElement);
    
    if (this.mobileMenuRef) {
      console.log('✓ Acceso a elemento nativo del menú:', this.mobileMenuRef.nativeElement.tagName);
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(value => !value);
    this.persistTheme();
    this.applyTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
    
    // Demostrar uso de Renderer2 para cambiar estilos
    if (this.mobileMenuRef) {
      if (this.isMobileMenuOpen()) {
        this.renderer.setStyle(this.mobileMenuRef.nativeElement, 'display', 'flex');
        this.renderer.addClass(this.mobileMenuRef.nativeElement, 'header__actions--open');
        console.log('Renderer2: Menú abierto con setStyle y addClass');
      } else {
        this.renderer.removeClass(this.mobileMenuRef.nativeElement, 'header__actions--open');
        console.log('Renderer2: Menú cerrado con removeClass');
      }
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    if (this.mobileMenuRef) {
      this.renderer.removeClass(this.mobileMenuRef.nativeElement, 'header__actions--open');
    }
  }

  // Método de demostración para cambiar color del menú usando Renderer2
  changeMenuColor(color: string): void {
    if (this.mobileMenuRef) {
      this.renderer.setStyle(this.mobileMenuRef.nativeElement, 'backgroundColor', color);
      console.log(`Renderer2.setStyle(): Color del menú cambiado a ${color}`);
    }
  }

  // Método de demostración para cambiar texto usando Renderer2
  changeMenuText(text: string): void {
    if (this.mobileMenuRef) {
      this.renderer.setProperty(this.mobileMenuRef.nativeElement, 'title', text);
      console.log(`Renderer2.setProperty(): Título del menú cambiado a "${text}"`);
    }
  }

  // Método de demostración para añadir/remover clases CSS usando Renderer2
  toggleCustomClass(className: string): void {
    if (this.mobileMenuRef) {
      const hasClass = this.mobileMenuRef.nativeElement.classList.contains(className);
      if (hasClass) {
        this.renderer.removeClass(this.mobileMenuRef.nativeElement, className);
        console.log(`Renderer2.removeClass(): Clase "${className}" removida`);
      } else {
        this.renderer.addClass(this.mobileMenuRef.nativeElement, className);
        console.log(`Renderer2.addClass(): Clase "${className}" añadida`);
      }
    }
  }

  // HostListener para cerrar menú al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMobileMenuOpen()) return;

    const target = event.target as HTMLElement;
    const clickedInsideMenu = this.mobileMenuRef?.nativeElement.contains(target);
    const clickedOnHamburger = this.hamburgerButtonRef?.nativeElement.contains(target);

    if (!clickedInsideMenu && !clickedOnHamburger) {
      this.closeMobileMenu();
      console.log('@HostListener: Menú cerrado por click fuera');
    }
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const initialValue = savedTheme ? savedTheme === 'dark' : this.getSystemPreference();
    this.isDarkMode.set(initialValue);
    this.applyTheme();
  }

  private getSystemPreference(): boolean {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('Sistema detectado - prefers-color-scheme:', isDark ? 'dark' : 'light');
    return isDark;
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
