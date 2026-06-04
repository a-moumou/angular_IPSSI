/**
 * Configuration globale du Pokédex : routeur, HTTP, hydratation SSR.
 * Active aussi le binding des paramètres de route en @Input des composants.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()), // :name de la route → input() du composant
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
  ],
};
