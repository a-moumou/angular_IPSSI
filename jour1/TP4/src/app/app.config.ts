/**
 * Configuration globale de l'application Angular (providers).
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Écoute des erreurs globales
    provideRouter(routes),                  // Routage (vide pour ce TP)
    provideClientHydration(withEventReplay()), // Hydratation SSR + rejeu des événements
    provideHttpClient(withFetch()),         // Client HTTP pour json-server
  ]
};
