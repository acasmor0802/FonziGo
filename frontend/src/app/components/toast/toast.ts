import { Component, inject, DestroyRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService, ToastMessage } from '../../shared/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.sass']
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  toasts = signal<ToastMessage[]>([]);

  ngOnInit(): void {
    this.toastService.toasts$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(toasts => {
        this.toasts.set(toasts);
      });
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '[OK]',
      error: '[X]',
      info: '[i]',
      warning: '[!]'
    };
    return icons[type] || '[i]';
  }
}
