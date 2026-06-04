/**
 * Configuration globale de l'application Angular (providers).
 * Active le routeur, le client HTTP, l'hydratation et la gestion d'erreurs.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Objet exporté et passé au bootstrap de l'application
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Écoute les erreurs non capturées dans le navigateur
    provideRouter(routes),                  // Active le système de routes
    provideClientHydration(withEventReplay()), // Hydratation SSR + rejeu des événements
    provideHttpClient(withFetch()),       // Client HTTP utilisant l'API fetch
  ]
};
