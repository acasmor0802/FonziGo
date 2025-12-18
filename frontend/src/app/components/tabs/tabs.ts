import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.sass']
})
export class TabsComponent {
  activeTab = signal<string>('tab1');

  tabs = [
    { id: 'tab1', label: 'Descripcion', icon: '' },
    { id: 'tab2', label: 'Configuracion', icon: '' },
    { id: 'tab3', label: 'Estadisticas', icon: '' }
  ];

  selectTab(tabId: string): void {
    this.activeTab.set(tabId);
    console.log(`Tab seleccionado: ${tabId}`);
  }

  isActive(tabId: string): boolean {
    return this.activeTab() === tabId;
  }
}
