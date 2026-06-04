/**
 * Fusion de la config navigateur et des providers spécifiques au serveur SSR.
 */
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)) // Rendu serveur + routes SSR
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
