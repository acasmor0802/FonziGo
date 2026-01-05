import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // FASE 4 - Router con precarga de módulos lazy
    provideRouter(
      routes,
      withPreloading(PreloadAllModules) // Precarga todos los módulos lazy en segundo plano
    ),
    // FASE 5 - HttpClient con interceptors
    provideHttpClient(
      withInterceptors([
        loggingInterceptor,  // Primero: logging de requests
        authInterceptor,     // Segundo: añade token JWT
        errorInterceptor     // Tercero: manejo de errores
      ])
    )
  ]
};
