# Documentación Técnica - FonziGo

## Índice

1. [Introducción](#introducción)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Sistema de Eventos en Angular](#sistema-de-eventos-en-angular)
4. [Componentes Desarrollados](#componentes-desarrollados)
5. [Sistema de Temas (Dark/Light Mode)](#sistema-de-temas-darklight-mode)
6. [Servicios de la Aplicación](#servicios-de-la-aplicación)
7. [Validación de Formularios](#validación-de-formularios)
8. [Formularios Dinámicos con FormArray](#formularios-dinámicos-con-formarray)
9. [Compatibilidad y Requisitos](#compatibilidad-y-requisitos)
10. [Conclusiones](#conclusiones)

---

## Introducción

Este documento recoge toda la documentación técnica del proyecto FonziGo, una aplicación web desarrollada con Angular 21. A lo largo de este trabajo voy a explicar las decisiones técnicas que he tomado, los patrones de diseño implementados y cómo funciona cada parte del sistema.

El objetivo principal ha sido crear una aplicación moderna, accesible y mantenible, siguiendo las mejores prácticas actuales del desarrollo frontend. He puesto especial atención en utilizar las características más recientes de Angular, evitando APIs obsoletas y apostando por las nuevas funcionalidades que ofrece el framework.

### Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Angular | 21.0.0 | Framework principal |
| TypeScript | 5.x | Lenguaje de programación |
| SASS | 1.x | Preprocesador CSS |
| RxJS | 7.x | Programación reactiva |

---

## Arquitectura del Proyecto

He organizado el proyecto siguiendo una estructura modular que facilita tanto el desarrollo como el mantenimiento a largo plazo. La idea es que cada carpeta tenga una responsabilidad clara.

### Estructura de Carpetas

```
frontend/src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── accordion/       # Componente acordeón
│   │   ├── alert/           # Alertas y notificaciones
│   │   ├── button/          # Botón personalizado
│   │   ├── form-input/      # Campo de formulario
│   │   ├── form-select/     # Selector desplegable
│   │   ├── form-textarea/   # Área de texto
│   │   ├── modal/           # Ventanas modales
│   │   ├── tabs/            # Sistema de pestañas
│   │   ├── toast/           # Notificaciones toast
│   │   └── tooltip/         # Tooltips informativos
│   │
│   ├── layout/              # Componentes de estructura
│   │   ├── header/          # Cabecera de la aplicación
│   │   ├── footer/          # Pie de página
│   │   └── main/            # Contenedor principal
│   │
│   ├── pages/               # Páginas de la aplicación
│   │   └── style-guide/     # Guía de estilos
│   │
│   └── shared/              # Código compartido
│       ├── services/        # Servicios globales
│       ├── interceptors/    # Interceptores HTTP
│       └── validators/      # Validadores personalizados
│
└── styles/                  # Sistema de estilos ITCSS
    ├── 00-settings/         # Variables y configuración
    ├── 01-tools/            # Mixins y funciones
    ├── 02-generic/          # Reset y normalización
    ├── 03-elements/         # Estilos base HTML
    ├── 04-layout/           # Sistema de layout
    ├── 05-components/       # Estilos de componentes
    └── 06-utilities/        # Clases de utilidad
```

### Decisiones de Arquitectura

Una de las decisiones más importantes que he tomado ha sido utilizar **Standalone Components** en lugar del sistema tradicional de módulos. Esto significa que cada componente declara explícitamente sus dependencias, lo que hace el código más claro y reduce el acoplamiento.

También he implementado el patrón de **componentes presentacionales** (o "dumb components") para la UI, dejando toda la lógica de negocio en los servicios. De esta forma, los componentes son más fáciles de testear y reutilizar.

---

## Sistema de Eventos en Angular

Angular utiliza un sistema de arquitectura unidireccional para manejar los eventos. Esto puede sonar complejo, pero básicamente significa que los datos fluyen en una sola dirección: del componente a la vista.

### Flujo de un Evento

Cuando un usuario interactúa con la aplicación, por ejemplo haciendo clic en un botón, ocurre lo siguiente:

```
Usuario → Evento DOM → Template Angular → Método del Componente → Actualización de Estado → Re-renderizado
```

Para que quede más claro, he preparado este diagrama que muestra el flujo completo:

```
┌─────────────────────────────────────────────────────────────┐
│                 FLUJO DE EVENTOS EN ANGULAR                  │
└─────────────────────────────────────────────────────────────┘

  Usuario              DOM              Template           Componente
    │                   │                  │                   │
    ├── Click ─────────>│                  │                   │
    │                   │                  │                   │
    │                   ├── Captura ──────>│                   │
    │                   │   evento         │                   │
    │                   │                  │                   │
    │                   │                  ├── (click)="..." ─>│
    │                   │                  │                   │
    │                   │                  │                   ├─ Ejecuta
    │                   │                  │                   │  método
    │                   │                  │                   │
    │                   │                  │                   ├─ Actualiza
    │                   │                  │                   │  signals
    │                   │                  │                   │
    │                   │                  │<── Detecta ───────┤
    │                   │                  │    cambio         │
    │                   │                  │                   │
    │                   │<── Re-renderiza ─┤                   │
    │                   │                  │                   │
    │<── Feedback ──────┤                  │                   │
    │    visual         │                  │                   │
```

### Sintaxis de Event Binding

La sintaxis para vincular eventos en Angular es bastante intuitiva. Se utilizan paréntesis para indicar que estamos escuchando un evento:

```typescript
// Sintaxis básica
(nombreEvento)="metodo($event)"

// Ejemplos prácticos
(click)="onClick($event)"
(keyup.enter)="onEnter()"
(mouseenter)="onMouseEnter()"
```

### Control de Eventos

A veces necesitamos controlar el comportamiento por defecto de un evento o evitar que se propague a elementos padre. Angular nos proporciona acceso al objeto `$event` para esto:

```typescript
// Prevenir comportamiento por defecto (ej: evitar que un formulario se envíe)
onSubmit(event: Event): void {
  event.preventDefault();
  // Lógica personalizada
}

// Detener propagación (ej: evitar que un click llegue al padre)
onChildClick(event: MouseEvent): void {
  event.stopPropagation();
}
```

### Signals: El Nuevo Sistema de Reactividad

Una de las características más interesantes de las versiones recientes de Angular son los **Signals**. Los he utilizado extensamente en este proyecto porque ofrecen una forma más eficiente de manejar el estado.

```typescript
// Crear un signal
isDarkMode = signal(false);

// Leer el valor (hay que usar paréntesis)
console.log(this.isDarkMode()); // false

// Actualizar el valor
this.isDarkMode.set(true);

// Actualizar basándose en el valor anterior
this.isDarkMode.update(value => !value);
```

La ventaja de los signals frente al sistema tradicional es que Angular solo actualiza las partes de la vista que realmente han cambiado, en lugar de revisar todo el árbol de componentes.

---

## Componentes Desarrollados

He creado varios componentes reutilizables que forman la base de la interfaz de usuario. Voy a explicar los más importantes.

### Componente Button

El componente de botón es uno de los más utilizados. Soporta diferentes variantes, tamaños, estados de carga y posiciones de icono.

**Ubicación:** `components/button/`

**Propiedades de entrada:**
- `variant`: Estilo visual ('primary', 'secondary', 'ghost')
- `size`: Tamaño ('sm', 'md', 'lg')
- `loading`: Estado de carga
- `disabled`: Estado deshabilitado
- `icon`: Icono opcional
- `iconPosition`: Posición del icono ('left', 'right')

**Ejemplo del template (usando la nueva sintaxis @if):**

```html
<button
  [type]="type"
  [ngClass]="buttonClasses"
  [disabled]="isDisabled"
  [attr.aria-label]="ariaLabel"
  [attr.aria-busy]="loading ? 'true' : null"
  (click)="onClick($event)"
>
  @if (loading) {
    <span class="btn__spinner" aria-hidden="true">
      <!-- SVG del spinner -->
    </span>
  }

  @if (icon && iconPosition === 'left' && !loading) {
    <span class="btn__icon btn__icon--left" aria-hidden="true">
      {{ icon }}
    </span>
  }

  <span class="btn__content" [class.btn__content--hidden]="loading">
    <ng-content></ng-content>
  </span>

  @if (icon && iconPosition === 'right' && !loading) {
    <span class="btn__icon btn__icon--right" aria-hidden="true">
      {{ icon }}
    </span>
  }
</button>
```

Es importante destacar que he utilizado la nueva sintaxis `@if` en lugar de `*ngIf`. Esta es la forma recomendada en Angular 17+ y tiene varias ventajas:
- Mejor rendimiento en tiempo de compilación
- Sintaxis más limpia y legible
- Soporte nativo para `@else`

### Componente Alert

Las alertas permiten mostrar mensajes importantes al usuario con diferentes niveles de severidad.

**Ubicación:** `components/alert/`

**Template con la nueva sintaxis:**

```html
@if (isVisible()) {
  <div [ngClass]="alertClasses()" role="alert">
    <div class="alert__content">
      <ng-content></ng-content>
    </div>
    @if (closeable) {
      <app-button
        variant="ghost"
        size="sm"
        (clicked)="close()"
        ariaLabel="Cerrar alerta"
        class="alert__close"
      >
        ×
      </app-button>
    }
  </div>
}
```

### Componentes de Formulario

He desarrollado tres componentes principales para formularios: `FormInput`, `FormSelect` y `FormTextarea`. Todos siguen el mismo patrón de diseño y comparten características como:

- Soporte para etiquetas y textos de ayuda
- Mensajes de error integrados
- Estados de validación visual
- Accesibilidad completa con ARIA

**Ejemplo de FormSelect con @for (antes *ngFor):**

```html
<div class="form-select" [class.form-select--error]="errorText">
  <label class="form-select__label" [for]="id">
    {{ label }}
    @if (required) {
      <span class="form-select__required" aria-label="requerido">*</span>
    }
  </label>
  
  <select class="form-select__control" [id]="id">
    <option value="" disabled>{{ placeholder }}</option>
    @for (option of options; track option.value) {
      <option [value]="option.value" [disabled]="option.disabled">
        {{ option.label }}
      </option>
    }
  </select>

  @if (helpText && !errorText) {
    <p class="form-select__help">{{ helpText }}</p>
  }

  @if (errorText) {
    <p class="form-select__error" role="alert">{{ errorText }}</p>
  }
</div>
```

La directiva `@for` requiere obligatoriamente una expresión `track` para optimizar el renderizado. Esto es importante porque Angular necesita saber cómo identificar cada elemento de la lista para poder actualizarla eficientemente.

### Header con Menú Responsive

El componente Header incluye un menú hamburguesa para dispositivos móviles que se implementa con signals y eventos.

**Ubicación:** `layout/header/`

**Características implementadas:**
- Menú colapsable con animación
- Cierre automático al hacer clic fuera
- Cierre con tecla ESC
- Toggle de tema claro/oscuro

```typescript
// Estado del menú
isMobileMenuOpen = signal(false);

// Métodos de control
toggleMobileMenu(): void {
  this.isMobileMenuOpen.update(value => !value);
}

closeMobileMenu(): void {
  this.isMobileMenuOpen.set(false);
}

// Detección de clicks fuera del menú
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  if (this.isMobileMenuOpen() && !this.isClickInside(event)) {
    this.closeMobileMenu();
  }
}
```

### Modal

El componente modal permite mostrar contenido en una ventana superpuesta con múltiples formas de cierre.

**Características:**
- Cierre con botón X, overlay o tecla ESC
- Bloqueo del scroll del body mientras está abierto
- Proyección de contenido con `ng-content`
- Animaciones de entrada y salida

```typescript
isOpen = signal(false);

open(): void {
  this.isOpen.set(true);
  document.body.style.overflow = 'hidden';
}

close(): void {
  this.isOpen.set(false);
  document.body.style.overflow = '';
}

@HostListener('document:keydown.escape')
onEscapePress(): void {
  if (this.isOpen()) {
    this.close();
  }
}
```

### Accordion

Sistema de acordeón que permite tener múltiples items abiertos simultáneamente.

```typescript
openItems = signal<string[]>([]);

toggle(itemId: string): void {
  this.openItems.update(items => {
    if (items.includes(itemId)) {
      return items.filter(id => id !== itemId);
    }
    return [...items, itemId];
  });
}

isOpen(itemId: string): boolean {
  return this.openItems().includes(itemId);
}
```

---

## Sistema de Temas (Dark/Light Mode)

Implementar un sistema de temas que respete las preferencias del usuario.

### Funcionamiento

El sistema funciona en tres capas:

1. **Detección de preferencia del sistema:** Uso `matchMedia` para detectar si el usuario tiene configurado el modo oscuro en su sistema operativo.

2. **Persistencia en localStorage:** Guardo la preferencia del usuario para que se mantenga entre sesiones.

3. **Aplicación mediante clase CSS:** Añado o quito la clase `.dark-mode` del elemento `html`.

### Orden de Prioridad

Cuando la aplicación se carga, sigue este orden para determinar el tema:

```
1. ¿Hay preferencia guardada en localStorage? → Usarla
2. ¿No? → Detectar preferencia del sistema
3. ¿Tampoco? → Usar modo claro por defecto
```

### Implementación

```typescript
private initializeTheme(): void {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    this.isDarkMode.set(savedTheme === 'dark');
  } else {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode.set(systemPrefersDark);
  }
  
  this.applyTheme();
}

toggleTheme(): void {
  this.isDarkMode.update(value => !value);
  this.applyTheme();
  this.persistTheme();
}

private applyTheme(): void {
  const html = document.documentElement;
  if (this.isDarkMode()) {
    html.classList.add('dark-mode');
  } else {
    html.classList.remove('dark-mode');
  }
}

private persistTheme(): void {
  localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
}
```

### Variables CSS por Tema

Utilizo CSS Custom Properties (variables) para definir los colores de cada tema. Esto hace que cambiar de tema sea instantáneo y sin recargas.

```sass
// Modo claro (por defecto)
:root
  --bg-primary: #FEFEFE
  --bg-secondary: #f5f7fa
  --text-primary: #1a1a2e
  --text-secondary: #4a4a68
  --border-color: #d1d5db

// Modo oscuro
.dark-mode
  --bg-primary: #1a1a2e
  --bg-secondary: #252540
  --text-primary: #f5f5f5
  --text-secondary: #b0b0c0
  --border-color: #3a3a50
```

---

## Servicios de la Aplicación

Los servicios son la columna vertebral de la lógica de negocio en Angular. He implementado varios que cubren necesidades comunes.

### CommunicationService

Este servicio permite la comunicación entre componentes que no tienen relación directa padre-hijo. Utiliza `BehaviorSubject` de RxJS para mantener el estado.

```typescript
export interface NotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private notifications$ = new BehaviorSubject<NotificationPayload | null>(null);
  
  sendSuccessNotification(message: string, data?: any): void {
    this.notifications$.next({
      id: crypto.randomUUID(),
      type: 'success',
      message,
      timestamp: new Date(),
      data
    });
  }
  
  getNotifications$(): Observable<NotificationPayload | null> {
    return this.notifications$.asObservable();
  }
}
```

### ToastService

Servicio para mostrar notificaciones tipo toast que se auto-cierran después de un tiempo.

```typescript
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<ToastMessage[]>([]);
  
  // Duraciones por tipo
  private readonly durations = {
    success: 3000,
    error: 5000,
    info: 4000,
    warning: 4500
  };
  
  success(title: string, message: string, duration?: number): void {
    this.addToast('success', title, message, duration);
  }
  
  error(title: string, message: string, duration?: number): void {
    this.addToast('error', title, message, duration);
  }
  
  private addToast(type: ToastType, title: string, message: string, duration?: number): void {
    const toast: ToastMessage = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      duration: duration || this.durations[type],
      timestamp: new Date()
    };
    
    this.toasts.update(list => [...list, toast]);
    
    setTimeout(() => this.dismiss(toast.id), toast.duration);
  }
  
  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
```

### LoadingService e Interceptor

Para gestionar el estado de carga de forma centralizada, he creado un servicio que trabaja junto con un interceptor HTTP.

```typescript
// loading.service.ts
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;
  isLoading = signal(false);
  
  show(): void {
    this.loadingCount++;
    this.isLoading.set(true);
  }
  
  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      this.isLoading.set(false);
    }
  }
}

// loading.interceptor.ts
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

Para registrar el interceptor, hay que añadirlo en la configuración de la aplicación:

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loadingInterceptor])
    )
  ]
};
```

---

## Validación de Formularios

La validación es fundamental para garantizar la integridad de los datos. He creado una colección de validadores personalizados que cubren las necesidades más comunes.

### Validadores Síncronos

**Ubicación:** `shared/validators/custom-validators.ts`

#### Validador de Fortaleza de Contraseña

Este validador comprueba que la contraseña cumpla con requisitos de seguridad:

```typescript
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const errors: any = {};
    
    if (!/[A-Z]/.test(value)) errors.noUpperCase = true;
    if (!/[a-z]/.test(value)) errors.noLowerCase = true;
    if (!/[0-9]/.test(value)) errors.noNumber = true;
    if (!/[!@#$%^&*]/.test(value)) errors.noSymbol = true;
    if (value.length < 8) errors.tooShort = true;
    
    return Object.keys(errors).length ? { passwordStrength: errors } : null;
  };
}
```

#### Validador de Coincidencia de Contraseñas

Se aplica a nivel de FormGroup para comparar dos campos:

```typescript
export function passwordMatch(field1: string, field2: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control1 = group.get(field1);
    const control2 = group.get(field2);
    
    if (control1?.value !== control2?.value) {
      return { passwordMatch: true };
    }
    return null;
  };
}
```

#### Validador de NIF Español

Valida el formato y la letra de control del NIF:

```typescript
export function nifValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const nifRegex = /^[0-9]{8}[A-Z]$/i;
    if (!nifRegex.test(value)) {
      return { nif: { message: 'Formato inválido' } };
    }
    
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const number = parseInt(value.substring(0, 8), 10);
    const expectedLetter = letters[number % 23];
    const actualLetter = value.charAt(8).toUpperCase();
    
    if (expectedLetter !== actualLetter) {
      return { nif: { message: 'Letra incorrecta' } };
    }
    
    return null;
  };
}
```

#### Otros Validadores Disponibles

- `telefonoValidator()`: Teléfono español (9 dígitos, empieza por 6-9)
- `codigoPostalValidator()`: Código postal español (5 dígitos, 01000-52999)
- `totalMinimo(min, ...fields)`: Suma de campos debe superar un mínimo
- `edadMayor(fechaField, edad)`: Validar edad mínima desde fecha de nacimiento
- `atLeastOneRequired(...fields)`: Al menos un campo debe tener valor

### Validadores Asíncronos

Para validaciones que requieren consultar el servidor (como comprobar si un email ya está registrado), he creado validadores asíncronos.

```typescript
@Injectable({ providedIn: 'root' })
export class AsyncValidatorsService {
  
  emailUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      return timer(500).pipe( // Debounce de 500ms
        switchMap(() => this.checkEmailAvailability(control.value)),
        map(isAvailable => isAvailable ? null : { emailUnique: true }),
        catchError(() => of(null))
      );
    };
  }
  
  private checkEmailAvailability(email: string): Observable<boolean> {
    // En producción, esto sería una llamada HTTP real
    const registeredEmails = ['admin@test.com', 'user@test.com'];
    return of(!registeredEmails.includes(email.toLowerCase()));
  }
}
```

**Uso en un formulario:**

```typescript
constructor(
  private fb: FormBuilder,
  private asyncValidators: AsyncValidatorsService
) {}

this.form = this.fb.group({
  email: ['', 
    [Validators.required, Validators.email],           // Síncronos
    [this.asyncValidators.emailUnique()],              // Asíncronos
    { updateOn: 'blur' }                               // Validar al perder foco
  ]
});
```

**Mostrar estado de validación en el template:**

```html
<app-form-input
  label="Email"
  [formControl]="form.get('email')"
/>

@if (form.get('email')?.pending) {
  <span class="validation-pending">Comprobando disponibilidad...</span>
}

@if (form.get('email')?.hasError('emailUnique')) {
  <span class="validation-error">Este email ya está registrado</span>
}
```

---

## Formularios Dinámicos con FormArray

Una de las partes más complejas del proyecto ha sido implementar formularios dinámicos donde el usuario puede añadir o eliminar elementos. He utilizado `FormArray` de Angular Reactive Forms.

### Caso de Uso: Formulario de Factura

El componente `InvoiceForm` permite crear facturas con múltiples teléfonos, direcciones e items.

**Ubicación:** `components/invoice-form/`

### Estructura del Formulario

```typescript
this.invoiceForm = this.fb.group({
  cliente: ['', [Validators.required, Validators.minLength(3)]],
  fecha: ['', Validators.required],
  telefonos: this.fb.array([]),
  direcciones: this.fb.array([]),
  items: this.fb.array([])
});
```

### Creación de Grupos Dinámicos

Para cada tipo de elemento del array, defino una función que crea el FormGroup correspondiente:

```typescript
private createTelefonoFormGroup(): FormGroup {
  return this.fb.group({
    numero: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{8}$/)]],
    tipo: ['movil', Validators.required]
  });
}

private createItemFormGroup(): FormGroup {
  return this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    precio: [0, [Validators.required, Validators.min(0.01)]]
  });
}
```

### Getters para Acceder a los Arrays

```typescript
get telefonos(): FormArray {
  return this.invoiceForm.get('telefonos') as FormArray;
}

get items(): FormArray {
  return this.invoiceForm.get('items') as FormArray;
}
```

### Métodos para Añadir y Eliminar

```typescript
addTelefono(): void {
  this.telefonos.push(this.createTelefonoFormGroup());
}

removeTelefono(index: number): void {
  if (this.telefonos.length > 1) {
    this.telefonos.removeAt(index);
  }
}

addItem(): void {
  this.items.push(this.createItemFormGroup());
  this.calculateTotal();
}

removeItem(index: number): void {
  if (this.items.length > 1) {
    this.items.removeAt(index);
    this.calculateTotal();
  }
}
```

### Cálculo del Total

```typescript
total = signal(0);

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
```

### Template con FormArray

```html
<form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
  <!-- Datos básicos -->
  <app-form-input
    label="Cliente"
    formControlName="cliente"
    [errorText]="getError('cliente')"
  />
  
  <!-- Array de items -->
  <section formArrayName="items">
    <h3>Items de la factura</h3>
    
    @for (item of items.controls; track $index; let i = $index) {
      <div class="invoice-item" [formGroupName]="i">
        <app-form-input
          label="Descripción"
          formControlName="descripcion"
        />
        
        <app-form-input
          label="Cantidad"
          type="number"
          formControlName="cantidad"
          (input)="calculateTotal()"
        />
        
        <app-form-input
          label="Precio"
          type="number"
          formControlName="precio"
          (input)="calculateTotal()"
        />
        
        <div class="item-subtotal">
          {{ getItemSubtotal(i) | currency:'EUR' }}
        </div>
        
        <app-button
          variant="ghost"
          (clicked)="removeItem(i)"
          [disabled]="items.length === 1"
        >
          Eliminar
        </app-button>
      </div>
    }
    
    <app-button variant="secondary" (clicked)="addItem()">
      + Añadir Item
    </app-button>
  </section>
  
  <!-- Total -->
  <div class="invoice-total">
    <strong>Total: {{ total() | currency:'EUR' }}</strong>
  </div>
  
  <app-button type="submit" [disabled]="invoiceForm.invalid">
    Guardar Factura
  </app-button>
</form>
```

---

## Compatibilidad y Requisitos

### Navegadores Soportados

He diseñado la aplicación para funcionar en navegadores modernos. No se soporta Internet Explorer.

| Navegador | Versión Mínima | Estado |
|-----------|----------------|--------|
| Chrome | 90+ | ✅ Completo |
| Firefox | 88+ | ✅ Completo |
| Safari | 14+ | ✅ Completo |
| Edge | 90+ | ✅ Completo |
| IE 11 | - | ❌ No soportado |

### APIs Utilizadas y su Compatibilidad

| API | Propósito | Soporte |
|-----|-----------|---------|
| CSS Custom Properties | Sistema de temas | Universal |
| matchMedia | Detección de preferencias | Chrome 9+, Firefox 6+ |
| localStorage | Persistencia local | Universal |
| Fetch API | Peticiones HTTP | Universal (polyfill incluido) |
| ResizeObserver | Detección de redimensionado | Chrome 64+, Firefox 69+ |

### Requisitos de Desarrollo

Para trabajar en este proyecto necesitas:

- **Node.js:** 18.x o superior
- **npm:** 9.x o superior
- **Angular CLI:** 21.x

### Comandos Principales

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve
# La aplicación estará en http://localhost:4200

# Build de producción
ng build --configuration production

# Ejecutar tests
ng test

# Verificar código
ng lint
```

---

## Conclusiones

Este proyecto me ha permitido profundizar en muchos aspectos del desarrollo frontend moderno con Angular. Algunas de las lecciones más valiosas que me llevo son:

### Sobre la Nueva Sintaxis de Control de Flujo

La migración de `*ngIf` y `*ngFor` a `@if` y `@for` no es solo un cambio cosmético. La nueva sintaxis:
- Es más legible y se parece más a otros lenguajes
- Tiene mejor rendimiento en tiempo de compilación
- Ofrece un soporte más natural para `@else` y `@empty`
- Requiere `track` en los bucles, lo que fuerza buenas prácticas

### Sobre los Signals

Los signals han cambiado completamente mi forma de pensar sobre el estado en Angular. Son más simples que los Observables para casos donde no necesitas operadores complejos, y el rendimiento es notablemente mejor en aplicaciones grandes.

### Sobre la Arquitectura

Mantener una estructura clara de carpetas y responsabilidades bien definidas hace que el código sea mucho más fácil de mantener. Los componentes pequeños y focalizados son más fáciles de testear y reutilizar.

### Próximos Pasos

Como mejoras futuras me planteo:
- Implementar Server-Side Rendering (SSR) con Angular Universal
- Añadir más tests unitarios y de integración
- Explorar el uso de signals para gestión de estado global
- Mejorar la accesibilidad con auditorías automáticas

---

## Referencias Bibliográficas

- Angular Official Documentation. *Angular Developer Guide*. https://angular.dev
- RxJS Official Documentation. *RxJS Guide*. https://rxjs.dev
- Mozilla Developer Network. *Web APIs Reference*. https://developer.mozilla.org
- W3C. *WAI-ARIA Authoring Practices*. https://www.w3.org/WAI/ARIA/

---