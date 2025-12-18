import { Component, signal, HostListener, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.sass']
})
export class ModalComponent {
  isOpen = signal<boolean>(false);
  closed = output<void>();

  open(): void {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    console.log('Modal abierto');
  }

  close(): void {
    this.isOpen.set(false);
    document.body.style.overflow = ''; // Restaurar scroll
    this.closed.emit();
    console.log('Modal cerrado');
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.isOpen()) {
      this.close();
      console.log('Modal cerrado con tecla ESC');
    }
  }

  onOverlayClick(): void {
    this.close();
    console.log('Modal cerrado por click en overlay');
  }

  onContentClick(event: MouseEvent): void {
    // Prevenir que el click en el contenido cierre el modal
    event.stopPropagation();
  }
}
