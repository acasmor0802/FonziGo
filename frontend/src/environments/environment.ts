/**
 * Configuración de entorno de DESARROLLO para FonziGo.
 * Este archivo se usa cuando ejecutas: ng serve
 * Para producción se usa environment.prod.ts
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  googleClientId: '952787149260-mktleu05ui8av17c06uj9so115na9utt.apps.googleusercontent.com',
  appVersion: '1.0.0',
  appName: 'FonziGo'
} as const;

export type Environment = typeof environment;
