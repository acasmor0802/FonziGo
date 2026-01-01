import { Component, inject, DestroyRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.sass']
})
export class LoadingSpinnerComponent implements OnInit {
  private loadingService = inject(LoadingService);
  private destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadingService.isLoading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => {
        this.isLoading.set(loading);
      });
  }
}
