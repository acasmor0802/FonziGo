/**
 * Configuración de entorno para FonziGo.
 * Detecta automáticamente desarrollo vs producción.
 */

/** Detecta si estamos en desarrollo (ng serve en puerto 4200) */
const isDevelopment = typeof window !== 'undefined' && window.location.port === '4200';

/** Detecta si estamos en Render (producción) */
const isRender = typeof window !== 'undefined' && window.location.hostname.includes('onrender.com');

/** Configuración del entorno */
export const environment = {
  /** Indica si es entorno de producción */
  production: !isDevelopment,
  
  /** URL base de la API */
  apiUrl: isDevelopment 
    ? 'http://localhost:8080/api' 
    : isRender 
      ? 'https://fonzigo.onrender.com/api'
      : '/api',
  
  /** Client ID de Google OAuth */
  googleClientId: '952787149260-mktleu05ui8av17c06uj9so115na9utt.apps.googleusercontent.com',
  
  /** Versión de la aplicación */
  appVersion: '1.0.0',
  
  /** Nombre de la aplicación */
  appName: 'FonziGo'
} as const;

/** Tipo para el entorno (útil para tipado) */
export type Environment = typeof environment;
