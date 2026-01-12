import { environment } from '../../../environments/environment';

/** Placeholder para productos sin imagen */
const PLACEHOLDER_IMAGE = 'optimized/sinFotojpg-medium.webp';

/**
 * Mapeo de iconos de categoría (emoji/nombre) a archivo SVG
 */
const CATEGORY_ICON_MAP: Record<string, string> = {
  // Por slug de categoría
  'frutas-verduras': '/manzana.svg',
  'lacteos-huevos': '/queso.svg',
  'carnes-pescados': '/filete.svg',
  'panaderia': '/pan.svg',
  'bebidas': '/soda.svg',
  'despensa': '/lata-de-atun.svg',
  'congelados': '/copo-de-nieve.svg',
  'limpieza': '/escoba.svg',
  'cuidado-personal': '/alcohol-en-gel.svg',
  'mascotas': '/animales.svg',
};

/**
 * Obtiene el icono SVG para una categoría por su slug
 */
export function getCategoryIcon(slug: string): string {
  return CATEGORY_ICON_MAP[slug] || '/manzana.svg';
}

/**
 * Utilidad para construir URLs de imágenes correctamente
 * Evita duplicación de código en múltiples componentes
 */
export function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) {
    return PLACEHOLDER_IMAGE;
  }
  
  // URL externa completa
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // URL de API interna - usar placeholder (las imágenes del backend no existen todavía)
  if (imageUrl.startsWith('/api/')) {
    return PLACEHOLDER_IMAGE;
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

// ============================================
// UTILIDADES PARA IMÁGENES OPTIMIZADAS (SRCSET)
// ============================================

/** Tamaños disponibles para imágenes optimizadas */
export const IMAGE_SIZES = {
  small: 400,
  medium: 800,
  large: 1200
} as const;

/** Imágenes de logos de supermercados (para home/header) */
const SUPERMARKET_LOGOS = ['carrefour', 'dia', 'Lidl', 'mercadona'];

/**
 * Mapeo de productos por nombre a imagen optimizada.
 * Incluye productos de Mercadona con imagen real.
 * NOTA: Los nombres deben estar en minúsculas y sin espacios extra.
 */
const PRODUCT_IMAGE_BY_NAME: Record<string, string> = {
  // Lácteos y Huevos
  'leche entera hacendado': 'lecheEnteraHacendado',
  'huevos camperos l': 'huevosLHacendado',
  // Carnes y Pescados
  'pechuga de pollo': 'pechugaPolloHacendado',
  'salmón noruego': 'salmonHacendado',
  'salmon noruego': 'salmonHacendado',
  // Panadería
  'croissants pack 6': 'croissantHacendado',
  'pan de molde integral': 'panMoldeIntegral',
  // Frutas y Verduras
  'plátanos de canarias': 'platanoCanariasMercadona',
  'platanos de canarias': 'platanoCanariasMercadona',
  'manzanas golden': 'manzanaGoldenMercadona',
  // Bebidas
  'agua mineral 6l': 'aguaMineralMercadonajpg',
  'zumo de naranja': 'zumoNaranjaMercadona',
  // Despensa
  'aceite de oliva virgen extra': 'aceiteOlivaHacendado',
  'aceite oliva virgen extra': 'aceiteOlivaHacendado',
  'aceite oliva': 'aceiteOlivaHacendado',
  'pasta espaguetis': 'spaghettiMercadona',
  // Congelados
  'guisantes congelados': 'guisanteFinoMercadona',
  'pizza congelada': 'pizza4Quesos',
  // Limpieza
  'detergente líquido': 'detergenteLiquidoMercadona',
  'detergente liquido': 'detergenteLiquidoMercadona',
  'papel higiénico': 'papelHigienicoHacendado',
  'papel higienico': 'papelHigienicoHacendado',
  // Cuidado Personal
  'gel de ducha': 'gelDuchaMercadona',
  // Mascotas
  'pienso perro adulto': 'comidaPerrosAdultosMercadona',
  'comida gato': 'comidaGatoHumedaMercadona',
};

/** Palabras clave para buscar imágenes cuando no hay coincidencia exacta */
const PRODUCT_KEYWORDS: Array<{ keywords: string[]; image: string }> = [
  { keywords: ['leche', 'entera'], image: 'lecheEnteraHacendado' },
  { keywords: ['huevos', 'camperos'], image: 'huevosLHacendado' },
  { keywords: ['huevo'], image: 'huevosLHacendado' },
  { keywords: ['pechuga', 'pollo'], image: 'pechugaPolloHacendado' },
  { keywords: ['pollo'], image: 'pechugaPolloHacendado' },
  { keywords: ['salmon', 'salmón'], image: 'salmonHacendado' },
  { keywords: ['croissant'], image: 'croissantHacendado' },
  { keywords: ['pan', 'molde'], image: 'panMoldeIntegral' },
  { keywords: ['plátano', 'platano'], image: 'platanoCanariasMercadona' },
  { keywords: ['manzana'], image: 'manzanaGoldenMercadona' },
  { keywords: ['agua', 'mineral'], image: 'aguaMineralMercadonajpg' },
  { keywords: ['zumo', 'naranja'], image: 'zumoNaranjaMercadona' },
  { keywords: ['aceite'], image: 'aceiteOlivaHacendado' },
  { keywords: ['oliva'], image: 'aceiteOlivaHacendado' },
  { keywords: ['espagueti', 'spaghetti', 'spagueti'], image: 'spaghettiMercadona' },
  // Pasta de dientes - debe ir ANTES de 'pasta' genérico
  { keywords: ['pasta de dientes', 'pasta dientes', 'dentífrico', 'dentifrico'], image: 'pastaDeDientesMercadona' },
  { keywords: ['guisante'], image: 'guisanteFinoMercadona' },
  { keywords: ['pizza'], image: 'pizza4Quesos' },
  { keywords: ['detergente'], image: 'detergenteLiquidoMercadona' },
  { keywords: ['papel', 'higiénico', 'higienico'], image: 'papelHigienicoHacendado' },
  { keywords: ['gel', 'ducha'], image: 'gelDuchaMercadona' },
  { keywords: ['pienso', 'perro'], image: 'comidaPerrosAdultosMercadona' },
  { keywords: ['comida', 'gato'], image: 'comidaGatoHumedaMercadona' },
  { keywords: ['gato'], image: 'comidaGatoHumedaMercadona' },
  { keywords: ['perro'], image: 'comidaPerrosAdultosMercadona' },
];

/**
 * Busca una imagen optimizada por nombre del producto.
 * Primero intenta coincidencia exacta, luego por palabras clave.
 */
export function findOptimizedImageByName(productName: string): string | null {
  if (!productName) return null;
  const normalized = productName.toLowerCase().trim();
  
  // Coincidencia exacta
  if (PRODUCT_IMAGE_BY_NAME[normalized]) {
    return PRODUCT_IMAGE_BY_NAME[normalized];
  }
  
  // Búsqueda por palabras clave
  for (const entry of PRODUCT_KEYWORDS) {
    const matches = entry.keywords.some(keyword => normalized.includes(keyword.toLowerCase()));
    if (matches) {
      return entry.image;
    }
  }
  
  return null;
}

/**
 * Verifica si una imagen tiene versión optimizada local (para logos de supermercados).
 */
export function hasOptimizedVersion(imagePath: string): boolean {
  if (!imagePath) return false;
  const baseName = imagePath.replace(/\.[^/.]+$/, '').split('/').pop() || '';
  return SUPERMARKET_LOGOS.includes(baseName);
}

/**
 * Genera la ruta de una imagen optimizada.
 * @param originalPath - Ruta original de la imagen (ej: "mercadona.png")
 * @param size - Tamaño deseado ('small' | 'medium' | 'large' | 'original')
 * @returns Ruta a la imagen optimizada en WebP
 */
export function getOptimizedImagePath(
  originalPath: string,
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!originalPath) return '';
  
  // Extraer nombre base sin extensión
  const baseName = originalPath.replace(/\.[^/.]+$/, '').split('/').pop() || '';
  
  // Solo usar optimizada si existe
  if (!hasOptimizedVersion(originalPath)) {
    return getImageUrl(originalPath);
  }
  
  // Generar ruta optimizada
  const suffix = size === 'original' ? '' : `-${size}`;
  return `optimized/${baseName}${suffix}.webp`;
}

/**
 * Genera el atributo srcset para imágenes responsive.
 * @param originalPath - Ruta original de la imagen
 * @returns String para usar en atributo srcset, o vacío si no hay versión optimizada
 */
export function generateSrcset(originalPath: string): string {
  if (!originalPath || !hasOptimizedVersion(originalPath)) return '';
  
  const baseName = originalPath.replace(/\.[^/.]+$/, '').split('/').pop() || '';
  
  return [
    `optimized/${baseName}-small.webp 400w`,
    `optimized/${baseName}-medium.webp 800w`,
    `optimized/${baseName}-large.webp 1200w`
  ].join(', ');
}

/**
 * Genera el atributo sizes para imágenes responsive.
 * @param type - Tipo de imagen para determinar breakpoints
 * @returns String para usar en atributo sizes
 */
export function generateSizes(type: 'card' | 'logo' | 'hero' | 'thumbnail' = 'card'): string {
  switch (type) {
    case 'logo':
      return '(max-width: 576px) 80px, 120px';
    case 'hero':
      return '(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw';
    case 'thumbnail':
      return '80px';
    case 'card':
    default:
      return '(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, 280px';
  }
}
