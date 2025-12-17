import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button';

interface EventLog {
  tipo: string;
  timestamp: string;
  detalles: string;
}

@Component({
  selector: 'app-event-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './event-demo.html',
  styleUrls: ['./event-demo.sass']
})
export class EventDemoComponent {
  ultimoEvento = signal<string>('Ningún evento aún');
  eventLogs = signal<EventLog[]>([]);
  inputValue = signal<string>('');
  mouseEnterCount = signal<number>(0);
  propagationEnabled = signal<boolean>(true);
  focusCount = signal<number>(0);

  // ========== EVENTOS DE CLICK ==========
  onClick(event: MouseEvent): void {
    this.logEvento('click', `Click en botón - coordenadas: (${event.clientX}, ${event.clientY})`);
    console.log('🖱️ Click event:', event);
  }

  // ========== EVENTOS DE TECLADO ==========
  onKeyUp(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    this.inputValue.set(target.value);
    this.logEvento('keyup', `Tecla: "${event.key}" - Valor actual: "${target.value}"`);
    console.log('⌨️ KeyUp event:', event);
  }

  onKeyDown(event: KeyboardEvent): void {
    this.logEvento('keydown', `Tecla presionada: "${event.key}" - Código: ${event.code}`);
    console.log('⌨️ KeyDown event:', { key: event.key, code: event.code, ctrlKey: event.ctrlKey });
  }

  onEnter(): void {
    this.logEvento('keyup.enter', 'Enter presionado - Evento específico capturado');
    console.log('✅ Enter key pressed!');
  }

  // ========== EVENTOS DE MOUSE ==========
  onMouseEnter(): void {
    this.mouseEnterCount.update(count => count + 1);
    this.logEvento('mouseenter', `Mouse entró en el área (total: ${this.mouseEnterCount()})`);
    console.log('🖱️ MouseEnter event - count:', this.mouseEnterCount());
  }

  onMouseLeave(): void {
    this.logEvento('mouseleave', 'Mouse salió del área');
    console.log('🖱️ MouseLeave event');
  }

  // ========== EVENTOS DE FOCUS/BLUR ==========
  onFocus(): void {
    this.focusCount.update(count => count + 1);
    this.logEvento('focus', `Input recibió foco (total: ${this.focusCount()})`);
    console.log('🎯 Focus event - count:', this.focusCount());
  }

  onBlur(): void {
    this.logEvento('blur', 'Input perdió el foco');
    console.log('🎯 Blur event');
  }

  // ========== PREVENIR COMPORTAMIENTO POR DEFECTO ==========
  onSubmit(event: Event): void {
    event.preventDefault();
    this.logEvento('submit (prevented)', '⛔ Formulario no enviado - preventDefault() aplicado');
    console.log('🛑 Form submit prevented!', event);
  }

  onLinkClick(event: Event): void {
    event.preventDefault();
    this.logEvento('click (prevented)', '⛔ Navegación bloqueada - preventDefault() en enlace');
    console.log('🛑 Link navigation prevented!', event);
  }

  // ========== PROPAGACIÓN DE EVENTOS ==========
  onParentClick(): void {
    this.logEvento('parent click', '👨 Click en contenedor padre recibido');
    console.log('👨 Parent clicked!');
  }

  onChildClick(event: MouseEvent): void {
    if (this.propagationEnabled()) {
      this.logEvento('child click', '👶 Click en hijo - propagación permitida');
      console.log('👶 Child clicked - propagation allowed');
    } else {
      event.stopPropagation();
      this.logEvento('child click (stopped)', '👶 Click en hijo - stopPropagation() aplicado');
      console.log('🛑 Child clicked - propagation stopped!', event);
    }
  }

  togglePropagation(): void {
    this.propagationEnabled.update(value => !value);
    console.log('🔄 Propagation enabled:', this.propagationEnabled());
  }

  // ========== HELPERS ==========
  private logEvento(tipo: string, detalles: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.ultimoEvento.set(`${tipo} - ${detalles}`);
    
    this.eventLogs.update(logs => {
      const newLogs = [{tipo, timestamp, detalles}, ...logs];
      return newLogs.slice(0, 10); // Mantener solo los últimos 10
    });
  }

  limpiarLogs(): void {
    this.eventLogs.set([]);
    this.ultimoEvento.set('Logs limpiados');
    this.mouseEnterCount.set(0);
    this.focusCount.set(0);
    console.log('🧹 Event logs cleared');
  }
}
