import { Component, OnInit, OnDestroy, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../button/button';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './invoice-form.html',
  styleUrls: ['./invoice-form.sass']
})
export class InvoiceFormComponent implements OnInit {
  // Inyección moderna
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  // Estado con signals
  invoiceForm!: FormGroup;
  submitted = signal(false);
  total = signal(0);

  ngOnInit(): void {
    this.initForm();
    this.setupCalculation();
  }

  private initForm(): void {
    this.invoiceForm = this.fb.group({
      cliente: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required],
      telefonos: this.fb.array([
        this.createTelefonoFormGroup()
      ]),
      direcciones: this.fb.array([
        this.createDireccionFormGroup()
      ]),
      items: this.fb.array([
        this.createItemFormGroup()
      ])
    });
  }

  private setupCalculation(): void {
    // Suscribirse a cambios para recalcular total con cleanup automático
    this.invoiceForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.calculateTotal();
      });
  }

  // ===== FORM ARRAYS GETTERS =====

  get telefonos(): FormArray {
    return this.invoiceForm.get('telefonos') as FormArray;
  }

  get direcciones(): FormArray {
    return this.invoiceForm.get('direcciones') as FormArray;
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  // ===== CREAR FORMGROUPS =====

  private createTelefonoFormGroup(): FormGroup {
    return this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{8}$/)]],
      tipo: ['movil', Validators.required]
    });
  }

  private createDireccionFormGroup(): FormGroup {
    return this.fb.group({
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-5][0-9]{4}$/)]]
    });
  }

  private createItemFormGroup(): FormGroup {
    return this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  // ===== MÉTODOS ADD/REMOVE =====

  addTelefono(): void {
    this.telefonos.push(this.createTelefonoFormGroup());
  }

  removeTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  addDireccion(): void {
    this.direcciones.push(this.createDireccionFormGroup());
  }

  removeDireccion(index: number): void {
    if (this.direcciones.length > 1) {
      this.direcciones.removeAt(index);
    }
  }

  addItem(): void {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
    this.calculateTotal();
  }

  // ===== CÁLCULOS =====

  getItemSubtotal(index: number): number {
    const item = this.items.at(index).value;
    return (item.cantidad || 0) * (item.precio || 0);
  }

  calculateTotal(): void {
    let sum = 0;
    for (let i = 0; i < this.items.length; i++) {
      sum += this.getItemSubtotal(i);
    }
    this.total.set(sum);
  }

  // ===== SUBMIT =====

  onSubmit(): void {
    this.submitted.set(true);
    this.invoiceForm.markAllAsTouched();

    if (this.invoiceForm.invalid) {
      this.toastService.error('Por favor, corrige los errores del formulario');
      console.error('Formulario inválido');
      return;
    }

    this.toastService.success(`¡Factura creada! Total: €${this.total().toFixed(2)}`);
    console.log('Factura guardada:', this.invoiceForm.value);
  }

  reset(): void {
    this.invoiceForm.reset();
    this.submitted.set(false);
    
    // Resetear arrays a 1 elemento cada uno
    while (this.telefonos.length > 1) {
      this.telefonos.removeAt(1);
    }
    while (this.direcciones.length > 1) {
      this.direcciones.removeAt(1);
    }
    while (this.items.length > 1) {
      this.items.removeAt(1);
    }
    
    this.calculateTotal();
    this.toastService.info('Formulario reiniciado');
  }
}
