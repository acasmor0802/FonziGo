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
import { pendingChangesGuard } from './core/guards/pending-changes.guard';
import { productsResolver } from './core/resolvers/product.resolver';

export const routes: Routes = [
  // Rutas públicas
  {
    path: '',
    component: HomePage,
    title: 'FonziGo - Compara precios de supermercados',
    data: { breadcrumb: 'Inicio' }
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./pages/stats/stats').then(m => m.StatsPage),
    title: 'Estadísticas - FonziGo',
    data: { breadcrumb: 'Estadísticas' }
  },
  {
    path: 'productos',
    component: ProductsPage,
    title: 'Productos - FonziGo',
    resolve: { products: productsResolver },
    data: { breadcrumb: 'Productos' }
  },
  {
    path: 'supermercado/:id',
    component: SupermarketPage,
    title: 'Supermercado - FonziGo',
    data: { breadcrumb: 'Supermercado' }
  },
  {
    path: 'contacto',
    component: ContactPage,
    title: 'Contacto - FonziGo',
    data: { breadcrumb: 'Contacto' }
  },
  {
    path: 'privacidad',
    component: PrivacyPage,
    title: 'Política de Privacidad - FonziGo',
    data: { breadcrumb: 'Política de Privacidad' }
  },
  {
    path: 'terminos',
    component: TermsPage,
    title: 'Términos y Condiciones - FonziGo',
    data: { breadcrumb: 'Términos y Condiciones' }
  },
  {
    path: 'login',
    component: LoginPage,
    title: 'Iniciar Sesión - FonziGo',
    data: { breadcrumb: 'Iniciar Sesión' }
  },
  {
    path: 'register',
    component: RegisterPage,
    title: 'Registro - FonziGo',
    data: { breadcrumb: 'Registro' }
  },

  // Rutas con lazy loading (FASE 4 - Requisito)
  {
    path: 'perfil',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePage),
    title: 'Mi Perfil - FonziGo',
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
    data: { breadcrumb: 'Mi Perfil' }
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartPage),
    title: 'Mi Carrito - FonziGo',
    data: { breadcrumb: 'Mi Carrito' }
  },

  // Rutas de desarrollo
  {
    path: 'style-guide',
    component: StyleGuide,
    title: 'Guía de Estilos - FonziGo',
    data: { breadcrumb: 'Guía de Estilos' }
  },
  {
    path: 'legacy',
    component: Main,
    title: 'Legacy - FonziGo',
    data: { breadcrumb: 'Legacy' }
  },

  // Ruta 404 - Siempre al final (FASE 4 - Requisito wildcard)
  {
    path: '**',
    component: NotFoundPage,
    title: 'Página no encontrada - FonziGo',
    data: { breadcrumb: 'Página no encontrada' }
  }
];
