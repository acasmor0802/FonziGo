import { Component, Input, signal, computed } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './alert.html',
  styleUrls: ['./alert.sass']
})
export class Alert {
  @Input() type: AlertType = 'info';
  @Input() closeable = false;
  
  isVisible = signal(true);

  close(): void {
    this.isVisible.set(false);
  }

  alertClasses = computed(() => ({
    'alert': true,
    [`alert--${this.type}`]: true
  }));
}
