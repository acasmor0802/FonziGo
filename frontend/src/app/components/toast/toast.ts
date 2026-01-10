import { Component, inject, DestroyRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Check, X, Info, AlertTriangle, LucideIconData } from 'lucide-angular';
import { ToastService, ToastMessage } from '../../shared/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.sass']
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  toasts = signal<ToastMessage[]>([]);

  // Iconos de Lucide
  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly InfoIcon = Info;
  readonly WarningIcon = AlertTriangle;

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

  getIconComponent(type: string): LucideIconData {
    const icons: Record<string, LucideIconData> = {
      success: Check,
      error: X,
      info: Info,
      warning: AlertTriangle
    };
    return icons[type] || Info;
  }
}
