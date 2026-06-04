/**
 * Configuration Angular spécifique au serveur (SSR).
 * Fusionne la config navigateur avec le rendu côté serveur.
 */
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// Providers additionnels pour le rendu serveur
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)) // Active le SSR avec les routes serveur
  ]
};

// Config finale = config client + config serveur
export const config = mergeApplicationConfig(appConfig, serverConfig);
