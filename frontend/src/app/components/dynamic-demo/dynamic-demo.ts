import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-dynamic-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dynamic-demo.html',
  styleUrls: ['./dynamic-demo.sass']
})
export class DynamicDemoComponent implements AfterViewInit {
  @ViewChild('contenedor', { read: ElementRef }) contenedorRef!: ElementRef;
  
  private elementosCreados: HTMLElement[] = [];
  private contadorElementos = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    console.log('✓ DynamicDemo - Contenedor listo:', this.contenedorRef?.nativeElement);
  }

  crearElemento(): void {
    if (!this.contenedorRef) return;

    this.contadorElementos++;
    
    // Crear elemento usando Renderer2
    const nuevoDiv = this.renderer.createElement('div');
    const texto = this.renderer.createText(`Elemento #${this.contadorElementos}`);
    
    // Añadir texto al div
    this.renderer.appendChild(nuevoDiv, texto);
    
    // Aplicar clases CSS
    this.renderer.addClass(nuevoDiv, 'elemento-dinamico');
    this.renderer.addClass(nuevoDiv, 'fade-in');
    
    // Aplicar estilos inline
    this.renderer.setStyle(nuevoDiv, 'backgroundColor', this.getRandomColor());
    this.renderer.setStyle(nuevoDiv, 'padding', '1rem');
    this.renderer.setStyle(nuevoDiv, 'margin', '0.5rem 0');
    this.renderer.setStyle(nuevoDiv, 'borderRadius', '8px');
    this.renderer.setStyle(nuevoDiv, 'color', 'white');
    this.renderer.setStyle(nuevoDiv, 'fontWeight', 'bold');
    this.renderer.setStyle(nuevoDiv, 'textAlign', 'center');
    this.renderer.setStyle(nuevoDiv, 'cursor', 'pointer');
    this.renderer.setStyle(nuevoDiv, 'transition', 'transform 0.2s');
    
    // Añadir atributo data
    this.renderer.setAttribute(nuevoDiv, 'data-id', this.contadorElementos.toString());
    
    // Event listener en el elemento creado
    this.renderer.listen(nuevoDiv, 'mouseenter', () => {
      this.renderer.setStyle(nuevoDiv, 'transform', 'scale(1.05)');
    });
    
    this.renderer.listen(nuevoDiv, 'mouseleave', () => {
      this.renderer.setStyle(nuevoDiv, 'transform', 'scale(1)');
    });
    
    // Insertar elemento en el contenedor
    this.renderer.appendChild(this.contenedorRef.nativeElement, nuevoDiv);
    
    // Guardar referencia
    this.elementosCreados.push(nuevoDiv);
    
    console.log(`✅ Renderer2.createElement(): Elemento #${this.contadorElementos} creado e insertado`);
  }

  eliminarElemento(): void {
    if (this.elementosCreados.length === 0) {
      console.warn('⚠️ No hay elementos para eliminar');
      return;
    }
    
    // Eliminar el último elemento creado
    const ultimoElemento = this.elementosCreados.pop();
    
    if (ultimoElemento && this.contenedorRef) {
      // Animación de salida
      this.renderer.addClass(ultimoElemento, 'fade-out');
      
      // Eliminar después de la animación
      setTimeout(() => {
        this.renderer.removeChild(this.contenedorRef.nativeElement, ultimoElemento);
        console.log(`🗑️ Renderer2.removeChild(): Elemento eliminado`);
      }, 300);
    }
  }

  limpiarTodo(): void {
    if (this.elementosCreados.length === 0) return;
    
    // Eliminar todos los elementos
    this.elementosCreados.forEach(elemento => {
      if (this.contenedorRef) {
        this.renderer.removeChild(this.contenedorRef.nativeElement, elemento);
      }
    });
    
    this.elementosCreados = [];
    this.contadorElementos = 0;
    
    console.log('🧹 Todos los elementos eliminados');
  }

  private getRandomColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE',
      '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
