import { Component } from '@angular/core';
import { OnInit, inject, signal} from '@angular/core';
import { ProductService} from '../../core/services/product.service';
import { CategoryStats } from '../../shared/types';


@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.html',
  styleUrls: [],
})
export class StatsPage implements OnInit {
  private productService = inject(ProductService);
  stats: CategoryStats[] = [];
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getCategoryStats().subscribe({
      next: (data:CategoryStats[]) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error cuando cargas las estadisticas.');
        this.loading.set(false);
      }
    })
  }

  retry(): void {
    this.loadStats();
  }
}