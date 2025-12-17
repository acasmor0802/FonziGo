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
    { id: 'tab1', label: '📝 Descripción', icon: '📝' },
    { id: 'tab2', label: '⚙️ Configuración', icon: '⚙️' },
    { id: 'tab3', label: '📊 Estadísticas', icon: '📊' }
  ];

  selectTab(tabId: string): void {
    this.activeTab.set(tabId);
    console.log(`🗂️ Tab seleccionado: ${tabId}`);
  }

  isActive(tabId: string): boolean {
    return this.activeTab() === tabId;
  }
}
