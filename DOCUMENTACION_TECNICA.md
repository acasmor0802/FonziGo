# Documentación Técnica - FonziGo

## Índice

1. [Introducción](#introducción)
2. [FASE 1: Manipulación del DOM y Eventos](#fase-1-manipulación-del-dom-y-eventos)
   - 1.1 Acceso al DOM con ViewChild y ElementRef
   - 1.2 Modificación de propiedades y estilos con Renderer2
   - 1.3 Sistema de eventos en Angular (Event Binding)
   - 1.4 Componentes interactivos (Menú, Modal, Tabs, Tooltips)
   - 1.5 Theme Switcher funcional
3. [FASE 2: Componentes Interactivos y Comunicación](#fase-2-componentes-interactivos-y-comunicación)
   - 2.1 Servicios de comunicación entre componentes
   - 2.2 Patrón Observable/Subject para notificaciones
   - 2.3 Sistema de notificaciones (ToastService)
   - 2.4 Gestión de loading states (LoadingService)
   - 2.5 Separación de responsabilidades
4. [FASE 3: Formularios Reactivos Avanzados](#fase-3-formularios-reactivos-avanzados)
   - 3.1 FormBuilder, FormGroup y FormControl
   - 3.2 Validadores síncronos personalizados
   - 3.3 Validadores asíncronos con debounce
   - 3.4 FormArray para contenido dinámico
   - 3.5 Feedback visual de validación
5. [FASE 4: Enrutamiento SPA](#fase-4-enrutamiento-spa)
   - 4.1 Configuración de rutas
   - 4.2 Guards de navegación (AuthGuard, PendingChangesGuard)
   - 4.3 Resolvers y Lazy Loading
   - 4.4 Breadcrumbs dinámicos
6. [FASE 5: Comunicación HTTP](#fase-5-comunicación-http)
   - 5.1 HttpClient y servicios de datos
   - 5.2 Interceptores HTTP
   - 5.3 Manejo de errores centralizado
7. [FASE 6: Gestión del Estado](#fase-6-gestión-del-estado)
   - 6.1 Signals para estado local
   - 6.2 BehaviorSubject para estado compartido
   - 6.3 Persistencia con localStorage
   - 6.4 OnPush Change Detection
8. [FASE 7: Testing y Optimización](#fase-7-testing-y-optimización)
   - 7.1 Testing unitario con Vitest
   - 7.2 Optimización de producción
   - 7.3 Despliegue

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

## FASE 1: Manipulación del DOM y Eventos

**Criterios:** RA6.a, RA6.c, RA6.d, RA6.e, RA6.h

Esta fase implementa la manipulación del DOM y gestión de eventos en los componentes Angular, añadiendo interactividad básica como toggle de menús, modales, alerts y el sistema de temas.

### 1.1 Acceso al DOM con ViewChild y ElementRef

Para acceder a elementos del DOM en Angular, uso `@ViewChild` con una variable de referencia en el template:

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <nav #menuNav class="header__nav">
      <!-- contenido del menú -->
    </nav>
  `
})
export class Header implements AfterViewInit {
  @ViewChild('menuNav', { static: false }) menuNav!: ElementRef;

  ngAfterViewInit() {
    // Accedo al elemento nativo del DOM
    console.log(this.menuNav.nativeElement);
  }
}
```

**Puntos clave:**
- `@ViewChild` accede al elemento referenciado con `#nombreRef` en la plantilla
- `ElementRef` contiene la referencia al elemento nativo del DOM
- Uso `ngAfterViewInit` para acceder al DOM después de la inicialización

### 1.2 Modificación de propiedades y estilos con Renderer2

Para operaciones seguras y compatibles con diferentes plataformas (SSR, Web Workers), uso `Renderer2`:

```typescript
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  template: `<div #themeContainer>Contenido</div>`
})
export class ThemeSwitcher {
  @ViewChild('themeContainer', { static: false }) container!: ElementRef;

  constructor(private renderer: Renderer2) {}

  cambiarEstilo() {
    // Cambiar estilos con Renderer2
    this.renderer.setStyle(this.container.nativeElement, 'backgroundColor', 'var(--bg-primary)');
  }

  cambiarPropiedad() {
    // Cambiar propiedades con Renderer2
    this.renderer.setProperty(this.container.nativeElement, 'innerText', 'Tema cambiado');
  }

  toggleClase(isDark: boolean) {
    if (isDark) {
      this.renderer.addClass(document.documentElement, 'dark-mode');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark-mode');
    }
  }
}
```

**Métodos principales de Renderer2:**

| Método | Propósito |
|--------|-----------|
| `setStyle(el, prop, value)` | Cambia estilos inline |
| `setProperty(el, prop, value)` | Cambia propiedades del elemento |
| `addClass(el, class)` | Añade clase CSS |
| `removeClass(el, class)` | Elimina clase CSS |
| `createElement(tag)` | Crea elemento HTML |
| `appendChild(parent, child)` | Inserta elemento hijo |
| `removeChild(parent, child)` | Elimina elemento hijo |

### 1.3 Sistema de Eventos en Angular (Event Binding)

Angular usa un sistema de arquitectura unidireccional para manejar los eventos. Los datos fluyen en una sola dirección: del componente a la vista.

#### Flujo de un Evento

```
Usuario → Evento DOM → Template Angular → Método del Componente → Actualización de Estado → Re-renderizado
```

```
┌─────────────────────────────────────────────────────────────┐
│                 FLUJO DE EVENTOS EN ANGULAR                  │
└─────────────────────────────────────────────────────────────┘

  Usuario              DOM              Template           Componente
    │                   │                  │                   │
    ├── Click ─────────>│                  │                   │
    │                   ├── Captura ──────>│                   │
    │                   │                  ├── (click)="..." ─>│
    │                   │                  │                   ├─ Ejecuta método
    │                   │                  │                   ├─ Actualiza signals
    │                   │                  │<── Detecta cambio─┤
    │                   │<── Re-renderiza ─┤                   │
    │<── Feedback visual┤                  │                   │
```

#### Event Binding en Templates

```html
<!-- Sintaxis básica -->
<button (click)="onClick()">Haz clic aquí</button>

<!-- Con objeto evento -->
<input (keyup)="onKeyUp($event)">

<!-- Pseudoeventos para teclas específicas -->
<input (keyup.enter)="onEnter()">
<input (keyup.escape)="onEscape()">

<!-- Eventos de mouse -->
<div (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
  Hover me
</div>

<!-- Eventos de focus -->
<input (focus)="onFocus()" (blur)="onBlur()">
```

#### Prevenir comportamientos por defecto

```typescript
// Prevenir submit de formulario
onSubmit(event: Event): void {
  event.preventDefault();
  // Lógica personalizada sin recargar página
}

// Detener propagación (evitar que el click llegue al padre)
onChildClick(event: MouseEvent): void {
  event.stopPropagation();
}
```

#### Tabla de compatibilidad de eventos

| Evento | Chrome | Firefox | Safari | Edge | Uso |
|--------|--------|---------|--------|------|-----|
| click | ✅ | ✅ | ✅ | ✅ | Clicks en elementos |
| keydown/keyup | ✅ | ✅ | ✅ | ✅ | Teclado |
| mouseenter/leave | ✅ | ✅ | ✅ | ✅ | Hover |
| focus/blur | ✅ | ✅ | ✅ | ✅ | Focus de inputs |
| pointerdown | ✅ | ✅ | ✅ | ✅ | Touch + mouse |

### 1.4 Componentes Interactivos Implementados

#### Menú Hamburguesa (Header)

El menú móvil se controla con un signal `isMobileMenuOpen` y se cierra al hacer click fuera o presionar ESC:

```typescript
@Component({
  selector: 'app-header'
})
export class Header {
  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  // Cerrar al hacer click fuera del menú
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMobileMenuOpen() && !this.isClickInside(event)) {
      this.closeMobileMenu();
    }
  }

  // Cerrar con tecla ESC
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }
}
```

Template:
```html
<button (click)="toggleMobileMenu()" [attr.aria-expanded]="isMobileMenuOpen()">
  <span class="hamburger-icon"></span>
</button>

@if (isMobileMenuOpen()) {
  <nav class="mobile-menu" [@slideIn]>
    <!-- Enlaces del menú -->
  </nav>
}
```

#### Modal con cierre ESC

```typescript
@Component({
  selector: 'app-modal'
})
export class Modal {
  isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden'; // Bloquea scroll
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

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as Element).classList.contains('modal__overlay')) {
      this.close();
    }
  }
}
```

#### Alert Component

```typescript
@Component({
  selector: 'app-alert'
})
export class Alert {
  type = input<'success' | 'error' | 'warning' | 'info'>('info');
  closeable = input(true);
  isVisible = signal(true);
  closed = output<void>();

  close(): void {
    this.isVisible.set(false);
    this.closed.emit();
  }
}
```

### 1.5 Theme Switcher Funcional

El sistema de temas detecta preferencias del sistema, permite toggle manual y persiste la elección:

```typescript
@Component({
  selector: 'app-header'
})
export class Header implements OnInit {
  isDarkMode = signal(false);

  ngOnInit(): void {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // 1. Prioridad: localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // 2. Fallback: preferencia del sistema
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

  themeLabel = computed(() => 
    this.isDarkMode() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  );
}
```

**Variables CSS para temas:**

```sass
// Modo claro (por defecto)
:root
  --bg-primary: #FEFEFE
  --bg-secondary: #f5f7fa
  --text-primary: #1a1a2e
  --text-secondary: #4a4a68

// Modo oscuro
.dark-mode
  --bg-primary: #1a1a2e
  --bg-secondary: #252540
  --text-primary: #f5f5f5
  --text-secondary: #b0b0c0
```

### 1.6 Arquitectura del Proyecto

He organizado el proyecto siguiendo una estructura modular:

```
frontend/src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── alert/           # Alertas y notificaciones
│   │   ├── button/          # Botón personalizado
│   │   ├── modal/           # Ventanas modales
│   │   ├── toast/           # Notificaciones toast
│   │   └── ...
│   ├── core/                # Guards, interceptores, servicios auth
│   ├── layout/              # Header, Footer, Main
│   ├── pages/               # Páginas de la aplicación
│   └── shared/              # Servicios, tipos, validadores
└── styles/                  # Sistema ITCSS
```

**Decisiones de Arquitectura:**
- **Standalone Components**: Cada componente declara explícitamente sus dependencias
- **Componentes presentacionales**: UI separada de lógica de negocio
- **Signals**: Sistema moderno de reactividad para estado local

### 1.2 Decisiones de Arquitectura

Una de las decisiones más importantes que he tomado ha sido utilizar **Standalone Components** en lugar del sistema tradicional de módulos. Esto significa que cada componente declara explícitamente sus dependencias, lo que hace el código más claro y reduce el acoplamiento.

También he implementado el patrón de **componentes presentacionales** (o "dumb components") para la UI, dejando toda la lógica de negocio en los servicios. De esta forma, los componentes son más fáciles de testear y reutilizar.

---

## FASE 2: Componentes Interactivos y Comunicación

**Criterios:** RA6.e, RA6.g, RA6.h

Esta fase implementa la comunicación entre componentes usando servicios y patrones reactivos, independizando la lógica de presentación.

### 2.1 Servicios de Comunicación entre Componentes

Los servicios de comunicación permiten compartir datos y notificaciones entre componentes hermanos o no relacionados mediante inyección de dependencias.

#### CommunicationService

```typescript
// shared/communication.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  
  sendNotification(type: NotificationPayload['type'], message: string, data?: any): void {
    this.notifications$.next({
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date(),
      data
    });
  }
  
  sendSuccessNotification(message: string, data?: any): void {
    this.sendNotification('success', message, data);
  }
  
  getNotifications$(): Observable<NotificationPayload | null> {
    return this.notifications$.asObservable();
  }
}
```

### 2.2 Patrón Observable/Subject para Notificaciones

| Tipo Subject | Uso Recomendado | Ventajas |
|--------------|-----------------|----------|
| `Subject` | Eventos únicos (clicks, logs) | No retiene valor |
| `BehaviorSubject` | Estado compartido (filtros, user) | Valor inicial + histórico |
| `ReplaySubject` | Historial limitado de emisiones | Para logs/notificaciones |

**Uso en Componente Emisor:**
```typescript
constructor(private commService: CommunicationService) {}

onAction() {
  this.commService.sendSuccessNotification('Dato enviado desde componente');
}
```

**Uso en Componente Receptor:**
```typescript
private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.commService.getNotifications$()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(msg => console.log('Recibido:', msg));
}
```

### 2.3 Sistema de Notificaciones (ToastService)

Servicio centralizado para mostrar notificaciones tipo toast con auto-dismiss configurable:

```typescript
// shared/services/toast.service.ts
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration: number;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<ToastMessage[]>([]);
  readonly toasts$ = this.toasts.asReadonly();
  
  // Duraciones por tipo (ms)
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
  
  info(title: string, message: string, duration?: number): void {
    this.addToast('info', title, message, duration);
  }
  
  warning(title: string, message: string, duration?: number): void {
    this.addToast('warning', title, message, duration);
  }
  
  private addToast(type: ToastMessage['type'], title: string, message: string, duration?: number): void {
    const toast: ToastMessage = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      duration: duration || this.durations[type],
      timestamp: new Date()
    };
    
    this.toasts.update(list => [...list, toast]);
    
    // Auto-dismiss
    setTimeout(() => this.dismiss(toast.id), toast.duration);
  }
  
  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
```

**Componente Toast:**
```typescript
@Component({
  selector: 'app-toast',
  template: `
    @for (toast of toastService.toasts$(); track toast.id) {
      <div class="toast toast--{{ toast.type }}" [@fadeInOut]>
        <div class="toast__header">{{ toast.title }}</div>
        <div class="toast__message">{{ toast.message }}</div>
        <button (click)="toastService.dismiss(toast.id)">×</button>
      </div>
    }
  `
})
export class Toast {
  toastService = inject(ToastService);
}
```

### 2.4 Gestión de Loading States (LoadingService)

Servicio global con contador de peticiones para manejar spinner overlay:

```typescript
// core/services/loading.service.ts
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
  
  reset(): void {
    this.loadingCount = 0;
    this.isLoading.set(false);
  }
}
```

**Interceptor HTTP para loading automático:**
```typescript
// core/interceptors/loading.interceptor.ts
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

**Loading local en botones:**
```typescript
@Component({
  template: `
    <button [disabled]="isSaving()" (click)="save()">
      {{ isSaving() ? 'Guardando...' : 'Guardar' }}
    </button>
  `
})
export class UserForm {
  isSaving = signal(false);

  async save() {
    this.isSaving.set(true);
    try {
      await this.userService.save(this.user);
    } finally {
      this.isSaving.set(false);
    }
  }
}
```

### 2.5 Separación de Responsabilidades

**Principio SRP:** Componentes manejan solo UI y eventos, mientras servicios encapsulan lógica de negocio.

**Componente con lógica pesada (mal):**
```typescript
// NO hacer esto
export class UserListComponent {
  getUsers() {
    return this.http.get('/api/users').pipe(
      map(users => users.filter(u => u.active)),
      catchError(this.handleError)
    );
  }
}
```

**Componente limpio (bien):**
```typescript
// Componente solo presenta datos
export class UserListComponent {
  users$ = this.userService.getUsers();
  selectedUser = signal<User | null>(null);

  constructor(private userService: UserService) {}

  onSelect(user: User) {
    this.selectedUser.set(user);
    this.userService.selectUser(user.id);
  }
}
```

**Servicio con lógica (bien):**
```typescript
// Servicio maneja datos y lógica
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      map(users => users.filter(u => u.active)),
      catchError(this.handleError)
    );
  }
}
```

### Diagrama de Arquitectura de Servicios

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DE SERVICIOS                 │
└─────────────────────────────────────────────────────────────┘

  Componentes              Servicios              Estado Global
       │                       │                       │
       ├── UserListComponent   │                       │
       │        │              │                       │
       │        └──────────────┼── UserService ───────>│ BehaviorSubject
       │                       │                       │   (users$)
       ├── ProductComponent    │                       │
       │        │              │                       │
       │        └──────────────┼── ProductService ────>│ BehaviorSubject
       │                       │                       │   (products$)
       │                       │                       │
       └── Todos los          ─┼── ToastService ──────>│ signal
           componentes         │                       │   (toasts)
                               │                       │
                               ├── LoadingService ────>│ signal
                               │                       │   (isLoading)
                               │                       │
                               └── AuthService ───────>│ signal
                                                       │   (currentUser)
```

---

## FASE 3: Formularios Reactivos Avanzados

**Criterios:** RA6.d, RA6.e, RA6.h

Esta fase implementa formularios reactivos con validación completa, tanto síncrona como asíncrona, integrados con los componentes de formulario del proyecto.

### 3.1 FormBuilder, FormGroup y FormControl

Los formularios reactivos usan `FormBuilder` para declarar `FormGroup` y `FormControl` programáticamente:

```typescript
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `...`
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, telefonoValidator()]],
      provincia: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrength()]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: [passwordMatch('password', 'confirmPassword')]
    });
  }
}
```

**Template con bindings reactivos:**
```html
<form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
  <app-form-input
    formControlName="email"
    label="Email"
    type="email"
    [errorText]="getErrorMessage('email')"
  />
  
  <app-form-input
    formControlName="password"
    label="Contraseña"
    type="password"
    [errorText]="getErrorMessage('password')"
  />
  
  <button type="submit" [disabled]="registerForm.invalid || registerForm.pending">
    {{ registerForm.pending ? 'Validando...' : 'Registrarse' }}
  </button>
</form>
```

### 3.2 Validadores Síncronos Personalizados

**Ubicación:** `shared/validators/custom-validators.ts`

#### Validador de Fortaleza de Contraseña

```typescript
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const errors: ValidationErrors = {};
    
    if (!/[A-Z]/.test(value)) errors['noUpperCase'] = true;
    if (!/[a-z]/.test(value)) errors['noLowerCase'] = true;
    if (!/[0-9]/.test(value)) errors['noNumber'] = true;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors['noSymbol'] = true;
    if (value.length < 8) errors['tooShort'] = true;
    
    return Object.keys(errors).length ? { passwordStrength: errors } : null;
  };
}
```

#### Validador de Confirmación de Contraseña (Cross-field)

```typescript
export function passwordMatch(passwordField: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordField);
    const confirm = group.get(confirmField);
    
    if (!password || !confirm) return null;
    
    return password.value === confirm.value ? null : { passwordMismatch: true };
  };
}
```

#### Validador de NIF Español

```typescript
export function nifValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toUpperCase();
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

#### Validador de Teléfono Español

```typescript
export function telefonoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const cleanValue = value.replace(/\s/g, '');
    const telefonoRegex = /^[6-9][0-9]{8}$/;
    
    return telefonoRegex.test(cleanValue) 
      ? null 
      : { telefono: { message: 'Teléfono inválido (9 dígitos, empieza por 6-9)' } };
  };
}
```

#### Validador de Código Postal

```typescript
export function codigoPostalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const cpRegex = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
    
    return cpRegex.test(value) 
      ? null 
      : { codigoPostal: { message: 'CP inválido (01000-52999)' } };
  };
}
```

### Catálogo de Validadores Implementados

| Nombre | Tipo | Nivel | Descripción |
|--------|------|-------|-------------|
| `Validators.required` | Síncrono | Campo | Campo obligatorio |
| `Validators.email` | Síncrono | Campo | Formato email |
| `Validators.minLength(n)` | Síncrono | Campo | Longitud mínima |
| `Validators.pattern(regex)` | Síncrono | Campo | Patrón regex |
| `passwordStrength()` | Personalizado | Campo | Mayúsculas, minúsculas, números, símbolos |
| `nifValidator()` | Personalizado | Campo | NIF español con letra |
| `telefonoValidator()` | Personalizado | Campo | Móvil español (6/7 + 8 dígitos) |
| `codigoPostalValidator()` | Personalizado | Campo | CP español 5 dígitos |
| `passwordMatch()` | Cross-field | FormGroup | Password = confirmPassword |
| `totalMinimo()` | Cross-field | FormGroup | Suma de campos >= mínimo |
| `atLeastOneRequired()` | Cross-field | FormGroup | Al menos un campo requerido |
| `emailUnique()` | Asíncrono | Campo | Email no registrado |

### 3.3 Validadores Asíncronos con Debounce

Los validadores asíncronos consultan el servidor y usan debounce para optimizar llamadas:

```typescript
// shared/validators/async-validators.service.ts
@Injectable({ providedIn: 'root' })
export class AsyncValidatorsService {
  constructor(private http: HttpClient) {}
  
  emailUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      return timer(500).pipe( // Debounce de 500ms
        switchMap(() => this.checkEmailAvailability(control.value)),
        map(isAvailable => isAvailable ? null : { emailUnique: true }),
        catchError(() => of(null)) // Network error no bloquea
      );
    };
  }
  
  private checkEmailAvailability(email: string): Observable<boolean> {
    // En producción, llamada HTTP real
    const registeredEmails = ['admin@test.com', 'user@test.com'];
    return of(!registeredEmails.includes(email.toLowerCase())).pipe(delay(300));
  }
  
  usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.length < 3) return of(null);
      
      return timer(300).pipe(
        switchMap(() => this.checkUsername(control.value)),
        map(available => available ? null : { usernameTaken: true })
      );
    };
  }
}
```

**Uso en FormBuilder:**
```typescript
this.form = this.fb.group({
  email: ['', {
    validators: [Validators.required, Validators.email],
    asyncValidators: [this.asyncValidators.emailUnique()],
    updateOn: 'blur' // Solo valida al salir del campo
  }]
});
```

**Template con estados de loading:**
```html
<app-form-input formControlName="email" label="Email">
  @if (email?.pending) {
    <span class="validation-pending">Comprobando disponibilidad...</span>
  }
  @if (email?.errors?.['emailUnique'] && !email?.pending) {
    <span class="validation-error">Este email ya está registrado</span>
  }
</app-form-input>
```

### 3.4 FormArray para Contenido Dinámico

`FormArray` permite gestionar colecciones dinámicas de controles:

```typescript
@Component({
  selector: 'app-invoice-form'
})
export class InvoiceFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cliente: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required],
      telefonos: this.fb.array([]),
      direcciones: this.fb.array([]),
      items: this.fb.array([])
    });
    
    // Añadir elementos iniciales
    this.addTelefono();
    this.addItem();
  }

  // Getters para acceder a los arrays
  get telefonos(): FormArray {
    return this.form.get('telefonos') as FormArray;
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  // Crear grupos dinámicos
  private createTelefonoGroup(): FormGroup {
    return this.fb.group({
      numero: ['', [Validators.required, telefonoValidator()]],
      tipo: ['movil', Validators.required]
    });
  }

  private createItemGroup(): FormGroup {
    return this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  // Métodos para añadir/eliminar
  addTelefono(): void {
    this.telefonos.push(this.createTelefonoGroup());
  }

  removeTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  addItem(): void {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // Cálculo del total
  getTotal(): number {
    return this.items.value.reduce(
      (sum: number, item: any) => sum + (item.cantidad * item.precio), 0
    );
  }
}
```

**Template con FormArray:**
```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <!-- Items de factura -->
  <section formArrayName="items">
    <h3>Items de la factura</h3>
    
    @for (item of items.controls; track $index; let i = $index) {
      <div class="invoice-item" [formGroupName]="i">
        <app-form-input
          formControlName="descripcion"
          label="Descripción"
        />
        
        <app-form-input
          formControlName="cantidad"
          label="Cantidad"
          type="number"
          (input)="calculateTotal()"
        />
        
        <app-form-input
          formControlName="precio"
          label="Precio"
          type="number"
          (input)="calculateTotal()"
        />
        
        <div class="item-subtotal">
          {{ item.value.cantidad * item.value.precio | currency:'EUR' }}
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
  
  <div class="invoice-total">
    <strong>Total: {{ getTotal() | currency:'EUR' }}</strong>
  </div>
  
  <app-button type="submit" [disabled]="form.invalid">
    Guardar Factura
  </app-button>
</form>
```

### 3.5 Feedback Visual de Validación

#### Mostrar errores solo después de touched/dirty

```html
<app-form-input formControlName="email" label="Email">
  @if (email?.invalid && (email?.touched || email?.dirty)) {
    <div class="error">
      @if (email?.errors?.['required']) {
        <span>El email es obligatorio</span>
      }
      @if (email?.errors?.['email']) {
        <span>Formato de email inválido</span>
      }
    </div>
  }
</app-form-input>
```

#### Helper para mensajes de error

```typescript
getErrorMessage(controlName: string): string {
  const control = this.form.get(controlName);
  if (!control || !control.errors || !control.touched) return '';

  const errors = control.errors;
  if (errors['required']) return 'Este campo es obligatorio';
  if (errors['email']) return 'Email inválido';
  if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
  if (errors['telefono']) return errors['telefono'].message;
  if (errors['passwordStrength']) {
    const ps = errors['passwordStrength'];
    if (ps.tooShort) return 'Mínimo 8 caracteres';
    if (ps.noUpperCase) return 'Debe incluir mayúsculas';
    if (ps.noLowerCase) return 'Debe incluir minúsculas';
    if (ps.noNumber) return 'Debe incluir números';
    if (ps.noSymbol) return 'Debe incluir símbolos (!@#$%...)';
  }
  return 'Campo inválido';
}
```

#### CSS para estados de validación

Angular aplica clases automáticas (`ng-touched`, `ng-dirty`, `ng-valid`, `ng-invalid`):

```sass
input.ng-touched.ng-invalid
  border: 2px solid var(--error)

input.ng-touched.ng-valid
  border: 2px solid var(--success)

input.ng-pending
  border-style: dashed
  border-color: var(--primary-blue-light)
```

#### Deshabilitar submit si formulario inválido o validando

```html
<button type="submit" [disabled]="form.invalid || form.pending">
  {{ form.pending ? 'Validando...' : 'Enviar' }}
</button>
```

---

## FASE 4: Enrutamiento SPA

Angular Router es el sistema de navegación que permite crear aplicaciones de página única (SPA). He implementado un sistema de rutas completo con guards, resolvers y lazy loading.

### 4.1 Configuración de Rutas

Las rutas se definen en `app.routes.ts` con una estructura jerárquica:

```typescript
export const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomePage, data: { breadcrumb: 'Inicio' } },
  { path: 'productos', component: ProductsPage, resolve: { products: productsResolver } },
  { path: 'supermercado/:id', component: SupermarketPage },
  { path: 'contacto', component: ContactPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  
  // Rutas con lazy loading (carga diferida)
  {
    path: 'perfil',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePage),
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard]
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartPage)
  },
  
  // Ruta wildcard para 404
  { path: '**', component: NotFoundPage }
];
```

### 4.2 Guards de Navegación

#### AuthGuard

Protege rutas que requieren autenticación:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Guardar URL para redirección después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

#### PendingChangesGuard

Evita perder cambios no guardados:

```typescript
export const pendingChangesGuard: CanDeactivateFn<HasPendingChanges> = (component) => {
  if (component.hasPendingChanges && component.hasPendingChanges()) {
    return confirm('¿Deseas salir? Los cambios no guardados se perderán.');
  }
  return true;
};
```

### 4.3 Resolvers

Precargan datos antes de activar la ruta:

```typescript
export const productsResolver: ResolveFn<Product[]> = () => {
  const productService = inject(ProductService);
  return productService.getProducts();
};
```

### 4.4 Lazy Loading

Las rutas protegidas y secundarias usan carga diferida para mejorar el rendimiento inicial:

```typescript
{
  path: 'perfil',
  loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePage)
}
```

### 4.5 Breadcrumbs Dinámicos

El componente Breadcrumb lee los datos de las rutas para generar la navegación:

```typescript
this.router.events.pipe(
  filter(event => event instanceof NavigationEnd),
  map(() => this.createBreadcrumbs(this.route.root))
).subscribe(breadcrumbs => this.breadcrumbs.set(breadcrumbs));
```

### 4.6 Restauración de Scroll

Configurado en `app.config.ts` para restaurar la posición del scroll:

```typescript
provideRouter(routes, withViewTransitions(), withComponentInputBinding(), 
  withRouterConfig({ scrollPositionRestoration: 'enabled' }))
```

---

## FASE 5: Comunicación HTTP y Servicios

Los servicios son la columna vertebral de la lógica de negocio en Angular. He implementado varios que cubren necesidades comunes.

### 5.1 Sistema de Temas (Dark/Light Mode)

Implementar un sistema de temas que respete las preferencias del usuario.

#### Funcionamiento

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

### 5.2 CommunicationService

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

### 5.3 ToastService

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

### 5.4 LoadingService e Interceptor HTTP

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

### 5.5 Interceptores HTTP

Los interceptores permiten modificar peticiones y respuestas HTTP de forma centralizada:

- **LoadingInterceptor**: Muestra/oculta indicador de carga
- **AuthInterceptor**: Añade token JWT a las peticiones
- **ErrorInterceptor**: Gestiona errores HTTP globalmente con token `SKIP_ERROR_TOAST`

```typescript
// Error interceptor con skip de toast
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!req.context.get(SKIP_ERROR_TOAST)) {
        toastService.error('Error', error.message);
      }
      return throwError(() => error);
    })
  );
};
```

---

## FASE 6: Gestión del Estado

La gestión del estado es crucial para mantener la coherencia de datos en la aplicación. He utilizado múltiples estrategias según el caso de uso.

### 6.1 Signals para Estado Local

Angular Signals es el sistema moderno de reactividad. Lo uso para estado de componentes:

```typescript
// Estado reactivo con signals
isLoading = signal(false);
products = signal<Product[]>([]);
selectedProduct = signal<Product | null>(null);

// Computed para valores derivados
totalPrice = computed(() => 
  this.products().reduce((sum, p) => sum + p.price, 0)
);
```

### 6.2 BehaviorSubject para Estado Compartido

Para comunicación entre componentes sin relación padre-hijo:

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  
  readonly items$ = this.cartItems$.asObservable();
  readonly itemCount$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );
}
```

### 6.3 LocalStorage para Persistencia

El tema y el carrito persisten entre sesiones:

```typescript
private persistTheme(): void {
  localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
}

private loadTheme(): void {
  const saved = localStorage.getItem('theme');
  if (saved) {
    this.isDarkMode.set(saved === 'dark');
  }
}
```

### 6.4 OnPush Change Detection

Para optimizar el rendimiento, los componentes usan OnPush:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  product = input.required<Product>();
  bestPrice = computed(() => Math.min(...this.product().prices.map(p => p.price)));
}
```

### 6.5 takeUntilDestroyed para Suscripciones

Evita memory leaks destruyendo suscripciones automáticamente:

```typescript
private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.dataService.getData()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => this.data.set(data));
}
```

---

## FASE 7: Testing y Optimización

### 7.1 Testing Unitario

El proyecto utiliza **Vitest** como framework de testing (no Jasmine/Karma). Los tests se encuentran junto a los componentes y servicios.

#### Configuración de Tests

```typescript
// Ejemplo: auth.service.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when not logged in', () => {
    expect(service.isLoggedIn()).toBe(false);
  });
});
```

#### Tests de Componentes

```typescript
// product-card.spec.ts
describe('ProductCard', () => {
  it('should calculate best price correctly', () => {
    const mockProduct = {
      prices: [{ price: 10 }, { price: 5 }, { price: 8 }]
    };
    fixture.componentRef.setInput('product', mockProduct);
    expect(component.bestPrice()).toBe(5);
  });
});
```

### 7.2 Cobertura de Tests

| Tipo | Archivos | Tests |
|------|----------|-------|
| Servicios | auth, toast, loading | 30+ tests |
| Componentes | button, alert, form-input, product-card, login, register | 40+ tests |
| Total | 10+ archivos | 70+ tests |

### 7.3 Optimización de Producción

#### Budgets de Bundle

Configurados en `angular.json`:

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "600kB",
    "maximumError": "1MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "16kB",
    "maximumError": "32kB"
  }
]
```

#### Lazy Loading

Las rutas secundarias cargan bajo demanda:

```typescript
{
  path: 'perfil',
  loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePage)
}
```

#### OnPush Change Detection

Reduce ciclos de detección de cambios innecesarios.

### 7.4 Configuración de Producción

#### Dockerfile Multi-Stage

```dockerfile
# Stage 1: Build
FROM node:22.16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:1.25-alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

#### Nginx Optimizado

```nginx
# Gzip compression
gzip on;
gzip_types application/javascript text/css application/json;

# SPA routing
location / {
  try_files $uri $uri/ /index.html;
}

# Cache de assets
location ~* \.(js|css|png|jpg|svg|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

### 7.5 Despliegue

#### GitHub Pages (Frontend)

Configurado con GitHub Actions para despliegue automático en cada push a `main`.

#### Docker Compose (Full Stack)

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
  backend:
    build: ./backend
    ports:
      - "8080:8080"
  database:
    image: postgres:17
```

### 7.6 Comandos de Testing y Build

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm test -- --coverage

# Build de producción
npm run build -- --configuration production

# Verificar errores de tipos
npm run type-check
```

---