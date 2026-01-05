import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ShoppingList {
  id: number;
  name: string;
  itemCount: number;
  totalEstimate: number;
  createdAt: Date;
}

@Component({
  selector: 'app-shopping-lists',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shopping-lists.html',
  styleUrl: './shopping-lists.sass'
})
export class ShoppingListsPage implements OnInit {
  lists = signal<ShoppingList[]>([]);
  isCreating = signal(false);
  newListName = signal('');
  
  ngOnInit(): void {
    // Mock data - en producción vendría del servicio
    this.lists.set([
      {
        id: 1,
        name: 'Compra semanal',
        itemCount: 12,
        totalEstimate: 45.80,
        createdAt: new Date('2024-01-10')
      },
      {
        id: 2,
        name: 'Fiesta cumpleaños',
        itemCount: 8,
        totalEstimate: 32.50,
        createdAt: new Date('2024-01-12')
      }
    ]);
  }
  
  toggleCreate(): void {
    this.isCreating.update(v => !v);
    if (!this.isCreating()) {
      this.newListName.set('');
    }
  }
  
  createList(): void {
    const name = this.newListName().trim();
    if (!name) return;
    
    const newList: ShoppingList = {
      id: Date.now(),
      name,
      itemCount: 0,
      totalEstimate: 0,
      createdAt: new Date()
    };
    
    this.lists.update(current => [...current, newList]);
    this.newListName.set('');
    this.isCreating.set(false);
  }
  
  deleteList(id: number): void {
    if (confirm('¿Eliminar esta lista?')) {
      this.lists.update(current => current.filter(l => l.id !== id));
    }
  }
}
