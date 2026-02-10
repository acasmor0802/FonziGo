/**
 * Tipos compartidos de la aplicación FonziGo
 * Centraliza todas las interfaces y tipos para mejor mantenibilidad
 */

// =============================================================================
// User & Authentication
// =============================================================================

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  googleUser?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// =============================================================================
// Products & Catalog
// =============================================================================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  supermarketId?: number;
  supermarketName?: string;
  rating: number;
  ratingCount: number;
  onSale: boolean;
  stock?: number;
}

/**
 * Producto con campos adicionales para visualización en UI.
 * Incluye aliases para retrocompatibilidad con templates.
 */
export interface ProductUI extends Product {
  image: string;        // Alias de imageUrl
  category: string;     // Alias de categoryName
  reviews?: number;     // Alias de ratingCount
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
}

export interface Supermarket {
  id: number;
  name: string;
  logo: string;
}

// =============================================================================
// Pagination
// =============================================================================

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type ProductsResponse = PaginatedResponse<Product>;

// =============================================================================
// Cart & Orders
// =============================================================================

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  unit: string;
  supermarketName: string;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// =============================================================================
// API & Error Handling
// =============================================================================

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: string[];
}

// =============================================================================
// UI Components
// =============================================================================

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  timestamp: Date;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// =============================================================================
// Filters & Search
// =============================================================================

export interface ProductFilters {
  categoryId?: number;
  supermarketId?: number;
  search?: string;
  onSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'rating';
  sortDir?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

// =============================================================================
// Price Comparison
// =============================================================================

export interface PriceComparison {
  supermarketId: number;
  supermarketName: string;
  supermarketLogo?: string;
  store: string;          // Alias de supermarketName para UI
  price: number;
  originalPrice?: number;
  discount?: number;
  onSale: boolean;
  available: boolean;
}

/**
 * Producto con precios de múltiples supermercados para comparación.
 * Incluye campos adicionales para visualización en UI.
 */
export interface ProductWithPrices extends Omit<ProductUI, 'supermarketId' | 'supermarketName' | 'price' | 'originalPrice'> {
  prices: PriceComparison[];
  lowestPrice: number;
  highestPrice: number;
}

// =============================================================================
// STATS
// =============================================================================
export interface CategoryStats {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  productCount: number;
  averagePrice: number;
  onSaleCount: number;
  minPrice: number;
  maxPrice: number;
}