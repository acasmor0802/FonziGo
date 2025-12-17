import { Component, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.sass']
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() position: TooltipPosition = 'top';
  
  showTooltip = signal<boolean>(false);

  show(): void {
    this.showTooltip.set(true);
    console.log(`💡 Tooltip mostrado: "${this.text}"`);
  }

  hide(): void {
    this.showTooltip.set(false);
    console.log(`💡 Tooltip ocultado`);
  }
}
