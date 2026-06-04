/**
 * Configuration globale de l'application (providers Angular).
 * Active le routeur, HttpClient, Apollo GraphQL et l'hydratation client.
 */

import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
// withComponentInputBinding : lie les paramètres de route aux @input() des pages
import { provideRouter, withComponentInputBinding } from '@angular/router';
// Hydratation : réutilise le HTML SSR et rejoue les événements utilisateur
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';

/** Fabrique Apollo : client GraphQL pointant vers l'API officielle Rick & Morty */
function createApollo() {
  const httpLink = inject(HttpLink);
  return {
    link: httpLink.create({ uri: 'https://rickandmortyapi.com/graphql' }),
    cache: new InMemoryCache(),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideApollo(createApollo),
    provideClientHydration(withEventReplay()),
  ],
};
