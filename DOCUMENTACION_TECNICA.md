# 📚 Documentación Técnica - FonziGo Frontend

## Índice
1. [Arquitectura de Eventos](#arquitectura-de-eventos)
2. [Diagrama de Flujo de Eventos](#diagrama-de-flujo-de-eventos)
3. [Componentes Interactivos](#componentes-interactivos)
4. [Theme Switcher](#theme-switcher)
5. [Servicios Globales](#servicios-globales)
6. [Validadores de Formularios](#validadores-de-formularios)
7. [FormArray y Formularios Dinámicos](#formarray-y-formularios-dinamicos)
8. [Compatibilidad de Navegadores](#compatibilidad-de-navegadores)

---

## 🏗️ Arquitectura de Eventos

Angular implementa un sistema de **arquitectura unidireccional** para la gestión de eventos y detección de cambios, basado en tres pilares fundamentales:

### 1. Event Binding en Templates
```typescript
// Sintaxis básica
(eventName)="handler($event)"

// Ejemplos
(click)="onClick($event)"
(keyup.enter)="onEnter()"
(mouseenter)="onMouseEnter()"
```

### 2. Zone.js para Detección de Cambios
Zone.js intercepta operaciones asíncronas automáticamente y dispara la detección de cambios:
- Eventos del DOM (click, keyup, etc.)
- Timers (setTimeout, setInterval)
- Promesas y Observables
- XHR/Fetch requests

### 3. Signals para Estado Reactivo
```typescript
// Creación de signals
isDarkMode = signal(false);

// Lectura
console.log(this.isDarkMode()); // false

// Actualización
this.isDarkMode.set(true);
this.isDarkMode.update(value => !value);
```

### Modificadores de Eventos
Angular proporciona modificadores para eventos comunes:

```typescript
// Teclas específicas
(keyup.enter)="onEnter()"
(keydown.escape)="onEscape()"
(keydown.shift)="onShift()"

// Modificadores de mouse
(click.alt)="onAltClick()"
(click.ctrl)="onCtrlClick()"
(click.shift)="onShiftClick()"
```

### Prevención y Propagación
```typescript
// Prevenir comportamiento por defecto
onSubmit(event: Event): void {
  event.preventDefault();
  // Código personalizado
}

// Detener propagación
onChildClick(event: MouseEvent): void {
  event.stopPropagation();
  // El evento no llegará al padre
}
```

---

## 📊 Diagrama de Flujo de Eventos

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE EVENTOS EN ANGULAR               │
└─────────────────────────────────────────────────────────────┘

  Usuario                DOM                Template             Handler
    │                    │                    │                    │
    ├──── Interacción ──>│                    │                    │
    │    (click, etc.)   │                    │                    │
    │                    │                    │                    │
    │                    ├─── Captura ───────>│                    │
    │                    │    evento          │                    │
    │                    │                    │                    │
    │                    │                    ├── (event)="..." ──>│
    │                    │                    │                    │
    │                    │                    │                    ├─ Ejecuta
    │                    │                    │                    │  método
    │                    │                    │                    │
    │                    │                    │                    ├─ Actualiza
    │                    │                    │                    │  signals/
    │                    │                    │                    │  estado
    │                    │                    │                    │
    │                    │                    │<── Zone.js ────────┤
    │                    │                    │   detecta cambio   │
    │                    │                    │                    │
    │                    │<─── Re-renderiza ──┤                    │
    │                    │     vista          │                    │
    │                    │                    │                    │
    │<─── Feedback ──────┤                    │                    │
    │    visual          │                    │                    │

```

### Ejemplo Completo: Click en Menú Hamburguesa

```
1. Usuario hace click en botón hamburguesa
2. DOM captura el evento MouseEvent
3. Template detecta (clicked)="toggleMobileMenu()"
4. Se ejecuta toggleMobileMenu() en el componente
5. Signal isMobileMenuOpen se actualiza
6. Zone.js detecta el cambio
7. Angular re-renderiza la vista
8. El menú se abre con animación CSS
```

---

## 🎨 Componentes Interactivos Implementados

### 1. Menú Hamburguesa

**Ubicación:** `layout/header/header.ts`

**Descripción:**  
Menú móvil colapsable con animación suave y cierre automático al hacer click fuera.

**Eventos Manejados:**
- `(click)` en botón hamburguesa
- `@HostListener('document:click')` para detectar clicks fuera
- `(click)` en overlay para cerrar

**Estado Interno:**
```typescript
isMobileMenuOpen = signal(false);
```

**Métodos Públicos:**
- `toggleMobileMenu()` - Abre/cierra el menú
- `closeMobileMenu()` - Cierra el menú

**Características:**
- ✅ Usa `Renderer2` para manipulación del DOM
- ✅ Usa `ElementRef` para detectar clicks dentro/fuera
- ✅ Animaciones CSS con transiciones suaves
- ✅ Accesible con `aria-label`

---

### 2. Modal

**Ubicación:** `components/modal/modal.ts`

**Descripción:**  
Modal reutilizable con soporte para múltiples formas de cierre y proyección de contenido.

**Eventos Manejados:**
- `(click)` en botón X
- `(click)` en overlay
- `@HostListener('document:keydown.escape')` para tecla ESC
- `(click)` con `stopPropagation()` en contenido

**Estado Interno:**
```typescript
isOpen = signal(false);
```

**Métodos Públicos:**
- `open()` - Abre el modal y bloquea scroll
- `close()` - Cierra el modal y restaura scroll

**Características:**
- ✅ Cierre con ESC, overlay o botón X
- ✅ Bloquea scroll del body cuando está abierto
- ✅ `stopPropagation` para evitar cierre al hacer click en contenido
- ✅ Animaciones de entrada/salida
- ✅ Proyección de contenido con `ng-content`

---

### 3. Tabs

**Ubicación:** `components/tabs/tabs.ts`

**Descripción:**  
Sistema de pestañas con navegación fluida y contenido dinámico.

**Eventos Manejados:**
- `(click)` en botones de pestaña

**Estado Interno:**
```typescript
activeTab = signal('tab1');
tabs = [
  { id: 'tab1', label: '📝 Descripción', icon: '📝' },
  { id: 'tab2', label: '⚙️ Configuración', icon: '⚙️' },
  { id: 'tab3', label: '📊 Estadísticas', icon: '📊' }
];
```

**Métodos Públicos:**
- `selectTab(tabId: string)` - Cambia la pestaña activa
- `isActive(tabId: string)` - Verifica si una pestaña está activa

**Características:**
- ✅ Clase condicional para pestaña activa
- ✅ Transiciones suaves entre contenidos
- ✅ Accesible con `role="tab"` y `aria-selected`
- ✅ Responsive con iconos en mobile

---

### 4. Tooltip

**Ubicación:** `components/tooltip/tooltip.ts`

**Descripción:**  
Tooltips posicionables con animación fade-in en hover.

**Eventos Manejados:**
- `(mouseenter)` - Muestra tooltip
- `(mouseleave)` - Oculta tooltip

**Estado Interno:**
```typescript
showTooltip = signal(false);
@Input() text = '';
@Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
```

**Métodos Públicos:**
- `show()` - Muestra el tooltip
- `hide()` - Oculta el tooltip

**Características:**
- ✅ 4 posiciones: top, bottom, left, right
- ✅ Animación fade-in
- ✅ Flecha indicadora con CSS
- ✅ No interfiere con interacción (pointer-events: none)

---

### 5. Accordion

**Ubicación:** `components/accordion/accordion.ts`

**Descripción:**  
Acordeón con múltiples items expandibles/colapsables simultáneamente.

**Eventos Manejados:**
- `(click)` en headers de items

**Estado Interno:**
```typescript
openItems = signal<string[]>([]);
items: AccordionItem[] = [
  { id: 'item1', title: '...', content: '...', icon: '...' },
  // ...
];
```

**Métodos Públicos:**
- `toggle(itemId: string)` - Abre/cierra un item
- `isOpen(itemId: string)` - Verifica si un item está abierto

**Características:**
- ✅ Múltiples items abiertos simultáneamente
- ✅ Animación de expansión/colapso
- ✅ Icono rotativo (▼/▲)
- ✅ Accesible con `aria-expanded` y `aria-controls`

---

## 🌓 Theme Switcher

### Detección de `prefers-color-scheme`

```typescript
private getSystemPreference(): boolean {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log('🌓 Sistema detectado:', isDark ? 'dark' : 'light');
  return isDark;
}
```

### Variables CSS por Tema

#### Modo Claro (`:root`)
```sass
:root
  --color-background-primary: #ffffff
  --color-background-secondary: #f8f9fa
  --color-text-primary: #2d3436
  --color-text-secondary: #636e72
  --color-border: #dfe6e9
  --color-primary: #0066cc
  --color-primary-hover: #0052a3
```

#### Modo Oscuro (`.dark-mode`)
```sass
.dark-mode
  --color-background-primary: #2d3436
  --color-background-secondary: #1e272e
  --color-text-primary: #dfe6e9
  --color-text-secondary: #b2bec3
  --color-border: #636e72
  --color-primary: #74b9ff
  --color-primary-hover: #0984e3
```

### Persistencia en localStorage

```typescript
private persistTheme(): void {
  const themeValue = this.isDarkMode() ? 'dark' : 'light';
  localStorage.setItem('theme', themeValue);
}
```

### Orden de Prioridad al Cargar

1. **localStorage** (preferencia guardada del usuario)
2. **Preferencia del sistema** (`prefers-color-scheme`)
3. **Modo claro por defecto**

```typescript
private initializeTheme(): void {
  const savedTheme = localStorage.getItem('theme');
  const initialValue = savedTheme 
    ? savedTheme === 'dark' 
    : this.getSystemPreference();
  
  this.isDarkMode.set(initialValue);
  this.applyTheme();
}
```

---

## 🛠️ Servicios Globales

### 1. CommunicationService

**Propósito:** Comunicación entre componentes hermanos mediante BehaviorSubject.

**Ubicación:** `shared/services/communication.service.ts`

```typescript
export interface NotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  data?: any;
}

export interface SharedState {
  cartItemCount: number;
  userLoggedIn: boolean;
  currentTheme: 'light' | 'dark';
  lastActivity: Date;
}
```

**Métodos Principales:**
- `sendNotification(notification)` - Envía notificación
- `sendSuccessNotification(message, data?)` - Helper para éxito
- `sendErrorNotification(message, data?)` - Helper para error
- `updateSharedState(partialState)` - Actualiza estado compartido
- `getNotifications$()` - Observable de notificaciones
- `getSharedState$()` - Observable de estado compartido

**Uso:**
```typescript
// En componente emisor
constructor(private commService: CommunicationService) {}

enviarNotificacion() {
  this.commService.sendSuccessNotification('Operación exitosa!');
}

// En componente receptor
this.commService.getNotifications$()
  .pipe(takeUntilDestroyed())
  .subscribe(notification => {
    if (notification) {
      console.log(notification.message);
    }
  });
```

---

### 2. ToastService

**Propósito:** Notificaciones toast con auto-dismiss y stack vertical.

**Ubicación:** `shared/services/toast.service.ts`

```typescript
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration: number;
  timestamp: Date;
}
```

**Duraciones por Defecto:**
- Success: 3000ms
- Error: 5000ms
- Info: 4000ms
- Warning: 4500ms

**Métodos:**
- `success(title, message, duration?)` - Toast de éxito
- `error(title, message, duration?)` - Toast de error
- `info(title, message, duration?)` - Toast informativo
- `warning(title, message, duration?)` - Toast de advertencia
- `dismiss(id)` - Cierra un toast específico
- `dismissAll()` - Cierra todos los toasts

**Uso:**
```typescript
constructor(private toastService: ToastService) {}

mostrarExito() {
  this.toastService.success(
    '¡Éxito!', 
    'Los datos se guardaron correctamente'
  );
}

mostrarError() {
  this.toastService.error(
    'Error', 
    'No se pudo conectar con el servidor',
    7000 // duración personalizada
  );
}
```

**Componente ToastComponent:**
Añadir `<app-toast>` en el componente raíz (AppComponent o Main) para que esté disponible globalmente.

---

### 3. LoadingService

**Propósito:** Gestión centralizada de estados de carga con contador de peticiones.

**Ubicación:** `shared/services/loading.service.ts`

**Métodos:**
- `show()` - Incrementa contador y muestra loading
- `hide()` - Decrementa contador y oculta si llega a 0
- `setLoading(loading: boolean)` - Setter directo
- `getLoadingState()` - Getter del estado actual
- `reset()` - Resetea contador y estado

**LoadingInterceptor:**
```typescript
// shared/interceptors/loading.interceptor.ts
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

**Configuración en app.config.ts:**
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loadingInterceptor])
    )
  ]
};
```

**Componente LoadingSpinnerComponent:**
Añadir `<app-loading-spinner>` en el componente raíz para overlay global.

---

## ✅ Validadores de Formularios

### Validadores Síncronos

**Ubicación:** `shared/validators/custom-validators.ts`

#### 1. passwordStrength()
Valida fortaleza de contraseña (mayúscula, minúscula, número, símbolo, 8+ caracteres).

```typescript
import { passwordStrength } from './shared/validators/custom-validators';

this.form = this.fb.group({
  password: ['', [Validators.required, passwordStrength()]]
});

// Errores posibles
if (control.hasError('passwordStrength')) {
  const errors = control.errors['passwordStrength'];
  // errors.noUpperCase
  // errors.noLowerCase
  // errors.noNumber
  // errors.noSymbol
  // errors.tooShort
}
```

#### 2. passwordMatch(field1, field2)
Valida que dos campos coincidan (nivel FormGroup).

```typescript
this.form = this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}, { 
  validators: [passwordMatch('password', 'confirmPassword')] 
});
```

#### 3. nifValidator()
Valida formato y letra de NIF español.

```typescript
nif: ['', [Validators.required, nifValidator()]]
```

#### 4. telefonoValidator()
Valida teléfono español (9 dígitos, empieza con 6-9).

```typescript
telefono: ['', [Validators.required, telefonoValidator()]]
```

#### 5. codigoPostalValidator()
Valida código postal español (5 dígitos, 01000-52999).

```typescript
codigoPostal: ['', [Validators.required, codigoPostalValidator()]]
```

#### 6. totalMinimo(min, ...fields)
Valida que la suma de campos numéricos supere un mínimo (nivel FormGroup).

```typescript
this.form = this.fb.group({
  cantidad1: [0],
  cantidad2: [0],
  cantidad3: [0]
}, { 
  validators: [totalMinimo(100, 'cantidad1', 'cantidad2', 'cantidad3')] 
});
```

#### 7. edadMayor(fechaField, edadMin)
Valida edad mínima a partir de fecha de nacimiento (nivel FormGroup).

```typescript
this.form = this.fb.group({
  fechaNacimiento: ['', Validators.required]
}, { 
  validators: [edadMayor('fechaNacimiento', 18)] 
});
```

#### 8. atLeastOneRequired(...fields)
Valida que al menos uno de los campos tenga valor (nivel FormGroup).

```typescript
this.form = this.fb.group({
  email: [''],
  telefono: ['']
}, { 
  validators: [atLeastOneRequired('email', 'telefono')] 
});
```

---

### Validadores Asíncronos

**Ubicación:** `shared/validators/async-validators.service.ts`

#### 1. emailUnique()
Valida que un email no esté registrado (simula API con debounce 500ms).

```typescript
constructor(private asyncValidators: AsyncValidatorsService) {}

this.form = this.fb.group({
  email: ['', 
    [Validators.required, Validators.email],
    [this.asyncValidators.emailUnique()],
    { updateOn: 'blur' } // Solo validar al perder foco
  ]
});
```

#### 2. usernameAvailable()
Valida que un username esté disponible (simula API con debounce 500ms).

```typescript
username: ['',
  [Validators.required, Validators.minLength(3)],
  [this.asyncValidators.usernameAvailable()],
  { updateOn: 'blur' }
]
```

**Mostrar estado pending:**
```html
<input formControlName="email" />
@if (form.get('email')?.pending) {
  <span>🔄 Comprobando disponibilidad...</span>
}
@if (form.get('email')?.hasError('emailUnique')) {
  <span>❌ Este email ya está registrado</span>
}
```

---

## 📋 FormArray y Formularios Dinámicos

### Componente: InvoiceFormComponent

**Ubicación:** `components/invoice-form/invoice-form.ts`

**Descripción:**  
Formulario de factura con arrays dinámicos de teléfonos, direcciones e items.

### Estructura del Formulario

```typescript
this.invoiceForm = this.fb.group({
  cliente: ['', [Validators.required, Validators.minLength(3)]],
  fecha: ['', Validators.required],
  telefonos: this.fb.array([/* FormGroups */]),
  direcciones: this.fb.array([/* FormGroups */]),
  items: this.fb.array([/* FormGroups */])
});
```

### Creación de FormGroups

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

### Getters para FormArrays

```typescript
get telefonos(): FormArray {
  return this.invoiceForm.get('telefonos') as FormArray;
}

get items(): FormArray {
  return this.invoiceForm.get('items') as FormArray;
}
```

### Métodos Add/Remove

```typescript
addTelefono(): void {
  this.telefonos.push(this.createTelefonoFormGroup());
}

removeTelefono(index: number): void {
  if (this.telefonos.length > 1) {
    this.telefonos.removeAt(index);
  }
}
```

### Cálculo de Total

```typescript
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
<div formArrayName="items">
  @for (item of items.controls; track $index; let i = $index) {
    <div [formGroupName]="i">
      <input formControlName="descripcion" />
      <input formControlName="cantidad" type="number" />
      <input formControlName="precio" type="number" step="0.01" />
      
      <div class="subtotal">
        €{{ getItemSubtotal(i).toFixed(2) }}
      </div>
      
      <button type="button" (click)="removeItem(i)">
        🗑️
      </button>
    </div>
  }
</div>

<button type="button" (click)="addItem()">
  + Añadir Item
</button>
```

### Guía Rápida FormArray

#### 1. Acceso a elementos
```typescript
// Por índice
const firstItem = this.items.at(0);

// Iterar
this.items.controls.forEach((control, index) => {
  console.log(control.value);
});
```

#### 2. Validación
```typescript
// Validar todo el array
if (this.items.invalid) {
  console.log('Array tiene errores');
}

// Validar elemento específico
if (this.items.at(0).invalid) {
  console.log('Primer elemento inválido');
}
```

#### 3. Borrado Masivo
```typescript
// Limpiar todo
while (this.items.length > 0) {
  this.items.removeAt(0);
}

// Reiniciar con un elemento vacío
this.items.clear();
this.items.push(this.createItemFormGroup());
```

---

## 🌍 Compatibilidad de Navegadores

| Evento/API | Chrome | Firefox | Safari | Edge | Notas |
|------------|--------|---------|--------|------|-------|
| **Eventos del DOM** | | | | | |
| click | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| keydown | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| keyup | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| mouseenter | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| mouseleave | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| focus | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| blur | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| submit | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| **Métodos de Eventos** | | | | | |
| preventDefault() | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| stopPropagation() | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Estándar W3C |
| **APIs Modernas** | | | | | |
| matchMedia() | ✅ 9+ | ✅ 6+ | ✅ 5.1+ | ✅ 12+ | Para prefers-color-scheme |
| localStorage | ✅ 4+ | ✅ 3.5+ | ✅ 4+ | ✅ 12+ | Estándar |
| classList | ✅ 8+ | ✅ 3.6+ | ✅ 5.1+ | ✅ 10+ | add, remove, toggle |
| **Observables (RxJS)** | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Polyfill incluido |
| **Signals (Angular)** | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Requiere Angular 16+ |

### Notas Importantes

✅ **Compatibilidad Total:** Todos los eventos y APIs utilizados son estándar W3C con soporte universal.

⚠️ **Internet Explorer:** NO soportado. Este proyecto requiere navegadores modernos con soporte ES2020+.

🎯 **Versiones Mínimas Recomendadas:**
- Chrome: 90+
- Firefox: 88+
- Safari: 14+
- Edge: 90+

---

## 📦 Estructura del Proyecto

```
frontend/src/
├── app/
│   ├── components/
│   │   ├── accordion/
│   │   ├── dynamic-demo/
│   │   ├── event-demo/
│   │   ├── invoice-form/
│   │   ├── loading-spinner/
│   │   ├── modal/
│   │   ├── tabs/
│   │   ├── toast/
│   │   └── tooltip/
│   ├── layout/
│   │   ├── header/
│   │   ├── footer/
│   │   └── main/
│   └── shared/
│       ├── services/
│       │   ├── communication.service.ts
│       │   ├── toast.service.ts
│       │   └── loading.service.ts
│       ├── interceptors/
│       │   └── loading.interceptor.ts
│       └── validators/
│           ├── custom-validators.ts
│           └── async-validators.service.ts
└── styles/
    ├── 00-settings/
    │   └── _variables.sass
    ├── 01-tools/
    ├── 02-generic/
    ├── 03-elements/
    ├── 04-layout/
    ├── 05-components/
    └── 06-utilities/
```

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo
ng serve
# Abrir http://localhost:4200

# Build de producción
ng build --configuration production

# Tests
ng test

# Linting
ng lint
```

---

## 📝 Patrones de Comunicación Implementados

### 1. Parent → Child
```typescript
// Input properties
@Input() data: string;
```

### 2. Child → Parent
```typescript
// Output events
@Output() clicked = new EventEmitter<void>();
```

### 3. Siblings
```typescript
// Via servicio compartido
constructor(private commService: CommunicationService) {}
```

### 4. Global State
```typescript
// Via signals en servicio
sharedState = signal<State>({ ... });
```

---

## ✨ Mejores Prácticas Implementadas

✅ **Componentes "Dumb" y Servicios "Smart"**
- Componentes se enfocan en UI
- Servicios manejan lógica de negocio y estado

✅ **Standalone Components**
- Todos los componentes son standalone
- Imports explícitos y modulares

✅ **Signals para Estado Local**
- Reactividad granular
- Mejor rendimiento que Zone.js tradicional

✅ **BehaviorSubject para Estado Global**
- Estado sincrónico
- Replay del último valor

✅ **Validadores Reutilizables**
- Funciones puras y testables
- Separados en archivo dedicado

✅ **Interceptores HTTP**
- Centralización de lógica transversal
- Loading automático

✅ **Accesibilidad (a11y)**
- ARIA labels
- Roles semánticos
- Navegación por teclado

---

## 📚 Referencias

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular Forms](https://angular.dev/guide/forms)
- [MDN Web Docs - Events](https://developer.mozilla.org/es/docs/Web/Events)

---

**Última actualización:** Diciembre 2025  
**Versión Angular:** 21.0.0  
**Autor:** FonziGo Team
