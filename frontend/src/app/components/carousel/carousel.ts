import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de carrusel/slider accesible y reutilizable.
 *
 * Características de accesibilidad:
 * - Navegación completa por teclado (flechas izquierda/derecha)
 * - Roles ARIA: region, roledescription, aria-live para anuncios
 * - Indicador visual de posición actual (ej: "1-4 de 12")
 * - Focus visible en botones de navegación
 * - Respeta prefers-reduced-motion
 * - Botones deshabilitados correctamente cuando no hay más items
 */
@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnInit, OnDestroy {
  /** Título del carrusel para accesibilidad y heading visual */
  @Input({ required: true }) title!: string;

  /** Número total de items */
  @Input({ required: true }) totalItems!: number;

  /** ID único para vincular aria-labelledby */
  @Input() carouselId = 'carousel';

  /** Evento emitido cuando cambia el índice visible */
  @Output() indexChange = new EventEmitter<number>();

  /** Índice actual del primer item visible */
  currentIndex = signal(0);

  /** Items visibles por "página" (responsive) */
  itemsPerView = signal(5);

  /** Indica si el carrusel tiene más items de los que se muestran */
  hasOverflow = computed(() => this.totalItems > this.itemsPerView());

  /** Puede avanzar */
  canGoNext = computed(() =>
    this.currentIndex() + this.itemsPerView() < this.totalItems
  );

  /** Puede retroceder */
  canGoPrev = computed(() => this.currentIndex() > 0);

  /** Texto del indicador de posición */
  positionText = computed(() => {
    const start = this.currentIndex() + 1;
    const end = Math.min(
      this.currentIndex() + this.itemsPerView(),
      this.totalItems
    );
    return `${start}-${end} de ${this.totalItems}`;
  });

  /** Exponer Math para el template */
  readonly Math = Math;

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    this.calculateItemsPerView();
  }

  ngOnDestroy(): void {}

  /** Recalcular items por vista al redimensionar ventana */
  @HostListener('window:resize')
  onResize(): void {
    this.calculateItemsPerView();
  }

  /** Gestionar navegación por teclado cuando el carrusel tiene el foco */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'Home':
        event.preventDefault();
        this.goToStart();
        break;
      case 'End':
        event.preventDefault();
        this.goToEnd();
        break;
    }
  }

  /** Avanzar al siguiente grupo de items */
  next(): void {
    if (this.canGoNext()) {
      this.currentIndex.update(i => i + 1);
      this.indexChange.emit(this.currentIndex());
    }
  }

  /** Retroceder al grupo anterior de items */
  prev(): void {
    if (this.canGoPrev()) {
      this.currentIndex.update(i => i - 1);
      this.indexChange.emit(this.currentIndex());
    }
  }

  /** Ir al inicio */
  goToStart(): void {
    this.currentIndex.set(0);
    this.indexChange.emit(0);
  }

  /** Ir al final */
  goToEnd(): void {
    const maxIndex = Math.max(0, this.totalItems - this.itemsPerView());
    this.currentIndex.set(maxIndex);
    this.indexChange.emit(maxIndex);
  }

  /** Reset del índice (útil cuando cambian los items) */
  reset(): void {
    this.currentIndex.set(0);
    this.indexChange.emit(0);
  }

  /** Calcula cuántos items mostrar según el ancho de pantalla */
  private calculateItemsPerView(): void {
    const width = window.innerWidth;
    if (width < 768) {
      this.itemsPerView.set(2);
    } else if (width < 1024) {
      this.itemsPerView.set(4);
    } else {
      this.itemsPerView.set(5);
    }

    // Ajustar índice si excede el máximo tras redimensionar
    const maxIndex = Math.max(0, this.totalItems - this.itemsPerView());
    if (this.currentIndex() > maxIndex) {
      this.currentIndex.set(maxIndex);
      this.indexChange.emit(maxIndex);
    }
  }
}
