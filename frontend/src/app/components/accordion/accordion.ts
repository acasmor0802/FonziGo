import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon: string;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.html',
  styleUrls: ['./accordion.sass']
})
export class AccordionComponent {
  openItems = signal<string[]>([]);

  items: AccordionItem[] = [
    {
      id: 'item1',
      title: 'Que es Angular?',
      icon: 'A',
      content: 'Angular es un framework de desarrollo web mantenido por Google. Permite crear aplicaciones web de una sola pagina (SPA) con TypeScript, proporcionando una estructura robusta y escalable para proyectos empresariales.'
    },
    {
      id: 'item2',
      title: 'Que son los Signals?',
      icon: 'S',
      content: 'Los Signals son un nuevo sistema de reactividad en Angular que permite gestionar el estado de forma mas eficiente. Proporcionan cambios granulares y optimizan el rendimiento de la deteccion de cambios en comparacion con Zone.js.'
    },
    {
      id: 'item3',
      title: 'Como funciona este Accordion?',
      icon: '?',
      content: 'Este componente accordion utiliza signals para mantener el estado de los items abiertos. Permite abrir multiples items simultaneamente y utiliza animaciones CSS para transiciones suaves. El estado se actualiza con cada click en los headers.'
    }
  ];

  toggle(itemId: string): void {
    this.openItems.update(items => {
      if (items.includes(itemId)) {
        // Cerrar item
        console.log(`Accordion item cerrado: ${itemId}`);
        return items.filter(id => id !== itemId);
      } else {
        // Abrir item
        console.log(`Accordion item abierto: ${itemId}`);
        return [...items, itemId];
      }
    });
  }

  isOpen(itemId: string): boolean {
    return this.openItems().includes(itemId);
  }
}
