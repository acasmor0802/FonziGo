import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { LucideAngularModule, Package, Wallet, FileText, Plus, Trash2, ShoppingCart, X } from 'lucide-angular';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ToastService } from '../../shared/services/toast.service';
import { ToastComponent } from '../../components/toast/toast';

/**
 * Interfaz para un producto dentro de una lista de compra
 */
interface ListItem {
  productName: string;
  quantity: number;
  estimatedPrice: number;
  notes: string;
}

/**
 * Interfaz para una lista de compra completa
 */
interface ShoppingList {
  id: number;
  name: string;
  items: ListItem[];
  createdAt: Date;
}

/**
 * Página de gestión de listas de compra.
 * 
 * Implementa FormArray para gestionar colecciones dinámicas de productos
 * dentro de cada lista (FASE 3 - Requisito).
 */
@Component({
  selector: 'app-shopping-lists',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ReactiveFormsModule, 
    LucideAngularModule,
    Header,
    Footer,
    ToastComponent
  ],
  templateUrl: './shopping-lists.html',
  styleUrl: './shopping-lists.sass'
})
export class ShoppingListsPage implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  
  // Lucide Icons
  readonly PackageIcon = Package;
  readonly WalletIcon = Wallet;
  readonly FileTextIcon = FileText;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash2;
  readonly CartIcon = ShoppingCart;
  readonly XIcon = X;
  
  // Estado de la vista
  lists = signal<ShoppingList[]>([]);
  isCreating = signal(false);
  editingListId = signal<number | null>(null);
  
  /**
   * Formulario reactivo para crear/editar listas.
   * Usa FormArray para gestionar productos dinámicamente.
   */
  listForm!: FormGroup;
  
  ngOnInit(): void {
    this.initForm();
    this.loadMockData();
  }
  
  /**
   * Inicializa el formulario con FormArray para los items
   */
  private initForm(): void {
    this.listForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      items: this.fb.array([])
    });
  }
  
  /**
   * Carga datos de ejemplo (en producción vendría del backend)
   */
  private loadMockData(): void {
    this.lists.set([
      {
        id: 1,
        name: 'Compra semanal',
        items: [
          { productName: 'Leche entera', quantity: 2, estimatedPrice: 1.20, notes: 'Hacendado' },
          { productName: 'Pan de molde', quantity: 1, estimatedPrice: 1.50, notes: '' },
          { productName: 'Huevos camperos', quantity: 1, estimatedPrice: 2.80, notes: 'Docena' }
        ],
        createdAt: new Date('2024-01-10')
      },
      {
        id: 2,
        name: 'Fiesta cumpleaños',
        items: [
          { productName: 'Refrescos', quantity: 6, estimatedPrice: 1.20, notes: 'Variados' },
          { productName: 'Patatas fritas', quantity: 3, estimatedPrice: 2.00, notes: '' }
        ],
        createdAt: new Date('2024-01-12')
      }
    ]);
  }
  
  // =============================================
  // GETTERS PARA ACCESO AL FORMARRAY (FASE 3)
  // =============================================
  
  /**
   * Getter para acceder al FormArray de items.
   * Permite usar items.controls en el template.
   */
  get items(): FormArray {
    return this.listForm.get('items') as FormArray;
  }
  
  /**
   * Getter para el control del nombre
   */
  get nameControl() {
    return this.listForm.get('name');
  }
  
  // =============================================
  // MÉTODOS CRUD PARA FORMARRAY (FASE 3)
  // =============================================
  
  /**
   * Crea un FormGroup para un nuevo item de la lista
   */
  private createItemFormGroup(item?: ListItem): FormGroup {
    return this.fb.group({
      productName: [item?.productName || '', [Validators.required, Validators.minLength(2)]],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1), Validators.max(99)]],
      estimatedPrice: [item?.estimatedPrice || 0, [Validators.required, Validators.min(0)]],
      notes: [item?.notes || '', Validators.maxLength(100)]
    });
  }
  
  /**
   * Añade un nuevo item vacío al FormArray
   */
  addItem(): void {
    this.items.push(this.createItemFormGroup());
  }
  
  /**
   * Elimina un item del FormArray por índice
   */
  removeItem(index: number): void {
    if (this.items.length > 0) {
      this.items.removeAt(index);
    }
  }
  
  // =============================================
  // GESTIÓN DE LISTAS
  // =============================================
  
  /**
   * Abre el formulario para crear una nueva lista
   */
  startCreating(): void {
    this.isCreating.set(true);
    this.editingListId.set(null);
    this.listForm.reset({ name: '' });
    this.items.clear();
    // Añadir un item inicial
    this.addItem();
  }
  
  /**
   * Abre el formulario para editar una lista existente
   */
  editList(list: ShoppingList): void {
    this.isCreating.set(true);
    this.editingListId.set(list.id);
    
    // Resetear formulario
    this.listForm.patchValue({ name: list.name });
    this.items.clear();
    
    // Cargar items existentes en el FormArray
    list.items.forEach(item => {
      this.items.push(this.createItemFormGroup(item));
    });
    
    // Si no hay items, añadir uno vacío
    if (this.items.length === 0) {
      this.addItem();
    }
  }
  
  /**
   * Cancela la creación/edición
   */
  cancelEdit(): void {
    this.isCreating.set(false);
    this.editingListId.set(null);
    this.listForm.reset();
    this.items.clear();
  }
  
  /**
   * Guarda la lista (crear o actualizar)
   */
  saveList(): void {
    if (this.listForm.invalid) {
      this.listForm.markAllAsTouched();
      this.toastService.error('Por favor, corrige los errores del formulario');
      return;
    }
    
    const formValue = this.listForm.value;
    const listItems: ListItem[] = formValue.items.filter(
      (item: ListItem) => item.productName.trim() !== ''
    );
    
    if (listItems.length === 0) {
      this.toastService.warning('Añade al menos un producto a la lista');
      return;
    }
    
    const editingId = this.editingListId();
    
    if (editingId) {
      // Actualizar lista existente
      this.lists.update(current => 
        current.map(list => 
          list.id === editingId 
            ? { ...list, name: formValue.name, items: listItems }
            : list
        )
      );
      this.toastService.success('Lista actualizada correctamente');
    } else {
      // Crear nueva lista
      const newList: ShoppingList = {
        id: Date.now(),
        name: formValue.name,
        items: listItems,
        createdAt: new Date()
      };
      this.lists.update(current => [...current, newList]);
      this.toastService.success('Lista creada correctamente');
    }
    
    this.cancelEdit();
  }
  
  /**
   * Elimina una lista completa
   */
  deleteList(id: number): void {
    if (confirm('¿Eliminar esta lista y todos sus productos?')) {
      this.lists.update(current => current.filter(l => l.id !== id));
      this.toastService.success('Lista eliminada');
    }
  }
  
  // =============================================
  // UTILIDADES
  // =============================================
  
  /**
   * Calcula el total estimado de una lista
   */
  getListTotal(list: ShoppingList): number {
    return list.items.reduce((sum, item) => sum + (item.quantity * item.estimatedPrice), 0);
  }
  
  /**
   * Calcula el total del formulario actual
   */
  getFormTotal(): number {
    return this.items.controls.reduce((sum, control) => {
      const qty = control.get('quantity')?.value || 0;
      const price = control.get('estimatedPrice')?.value || 0;
      return sum + (qty * price);
    }, 0);
  }
  
  /**
   * Verifica si un control del FormArray tiene error
   */
  hasItemError(index: number, field: string): boolean {
    const control = this.items.at(index)?.get(field);
    return !!(control && control.invalid && control.touched);
  }
  
  /**
   * Obtiene el mensaje de error para un campo del FormArray
   */
  getItemErrorMessage(index: number, field: string): string {
    const control = this.items.at(index)?.get(field);
    if (!control || !control.errors || !control.touched) return '';
    
    if (control.errors['required']) return 'Obligatorio';
    if (control.errors['minlength']) return `Mín. ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return `Mínimo ${control.errors['min'].min}`;
    if (control.errors['max']) return `Máximo ${control.errors['max'].max}`;
    
    return 'Error';
  }
}
