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
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen.set(false);
    document.body.style.overflow = '';
    this.closed.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  onOverlayClick(): void {
    this.close();
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
