import { Component, Input } from '@angular/core';
import { CategoryStats } from '../../shared/types';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.html',
  styleUrls: [],
})
export class StatsCardComponent {
  @Input({ required: true }) stat!: CategoryStats;

  get formattedAvgPrice(): string {
    return this.stat.averagePrice.toFixed(2);
  }

  get formattedMinPrice(): string {
    return this.stat.minPrice.toFixed(2);
  }

  get formattedMaxPrice(): string {
    return this.stat.maxPrice.toFixed(2);
  }

  get offerPercentage(): number {
    if (this.stat.productCount === 0) return 0;
    return Math.round((this.stat.onSaleCount / this.stat.productCount) * 100);
  }
}