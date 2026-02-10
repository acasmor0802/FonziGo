import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CategoryStats } from '../../shared/types';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './stats-card.html',
  styleUrls: []
})
export class StatsCard {
  @Input({ required: true}) stats: CategoryStats | null = null;

  get formattedPrice(): string {
    return this.stats ? this.stats.averageprice.toFixed(2) : '';
  }

  get formattedMinPrice(): string {
    return this.stats ? this.stats.minprice.toFixed(2) : '';
  }

  get formattedMaxPrice(): string {
    return this.stats ? this.stats.maxprice.toFixed(2) : '';
  }

  get offerPercentage(): number {
    if (!this.stats || this.stats.productcount === 0) {
      return 0;
    }
    return (this.stats.offercount / this.stats.productcount) * 100;
  }
}