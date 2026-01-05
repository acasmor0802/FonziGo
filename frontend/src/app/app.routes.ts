import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { RegisterPage } from './pages/register/register-page';
import { Main } from './layout/main/main';
import { StyleGuide } from './pages/style-guide/style-guide';
import { HomePage } from './pages/home/home';
import { ProductsPage } from './pages/products/products';
import { ContactPage } from './pages/contact/contact';
import { SupermarketPage } from './pages/supermarket/supermarket';
import { NotFoundPage } from './pages/not-found/not-found';
import { PrivacyPage } from './pages/privacy/privacy';
import { TermsPage } from './pages/terms/terms';
import { authGuard } from './core/guards/auth.guard';
import { productsResolver } from './core/resolvers/product.resolver';

export const routes: Routes = [
  // Rutas públicas
  { 
    path: '', 
    component: HomePage,
    data: { breadcrumb: 'Inicio' }
  },
  { 
    path: 'productos', 
    component: ProductsPage,
    resolve: { products: productsResolver },
    data: { breadcrumb: 'Productos' }
  },
  { 
    path: 'supermercado/:id', 
    component: SupermarketPage,
    data: { breadcrumb: 'Supermercado' }
  },
  { 
    path: 'contacto', 
    component: ContactPage,
    data: { breadcrumb: 'Contacto' }
  },
  {
    path: 'privacidad',
    component: PrivacyPage,
    data: { breadcrumb: 'Política de Privacidad' }
  },
  {
    path: 'terminos',
    component: TermsPage,
    data: { breadcrumb: 'Términos y Condiciones' }
  },
  { 
    path: 'login', 
    component: LoginPage,
    data: { breadcrumb: 'Iniciar Sesión' }
  },
  { 
    path: 'register', 
    component: RegisterPage,
    data: { breadcrumb: 'Registro' }
  },
  
  // Rutas con lazy loading (FASE 4 - Requisito)
  {
    path: 'perfil',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePage),
    canActivate: [authGuard],
    data: { breadcrumb: 'Mi Perfil' }
  },
  {
    path: 'mis-listas',
    loadComponent: () => import('./pages/shopping-lists/shopping-lists').then(m => m.ShoppingListsPage),
    canActivate: [authGuard],
    data: { breadcrumb: 'Mis Listas' }
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartPage),
    data: { breadcrumb: 'Mi Carrito' }
  },
  
  // Rutas de desarrollo
  { 
    path: 'style-guide', 
    component: StyleGuide,
    data: { breadcrumb: 'Guía de Estilos' }
  },
  { 
    path: 'legacy', 
    component: Main,
    data: { breadcrumb: 'Legacy' }
  },
  
  // Ruta 404 - Siempre al final (FASE 4 - Requisito wildcard)
  { 
    path: '**', 
    component: NotFoundPage,
    data: { breadcrumb: 'Página no encontrada' }
  }
];
