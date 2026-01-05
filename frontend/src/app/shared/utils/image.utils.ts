import { environment } from '../../../environments/environment';

/**
 * Utilidad para construir URLs de imágenes correctamente
 * Evita duplicación de código en múltiples componentes
 */
export function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) {
    return '/assets/images/placeholder.jpg';
  }
  
  // URL externa completa
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // URL de API interna
  if (imageUrl.startsWith('/api/')) {
    return `${environment.apiUrl.replace('/api', '')}${imageUrl}`;
  }
  
  // Emoji o asset local
  return imageUrl;
}

/**
 * Formatea un precio a formato de moneda española
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

/**
 * Calcula el porcentaje de descuento
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) {
    return 0;
  }
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
