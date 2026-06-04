/**
 * Point d'entrée côté navigateur de l'application Angular.
 * Monte le composant racine App avec la configuration globale (routes, HTTP, Apollo).
 */

// bootstrapApplication : démarre l'app en mode standalone (sans NgModule racine)
import { bootstrapApplication } from '@angular/platform-browser';
// Configuration des providers (router, HttpClient, GraphQL, hydratation)
import { appConfig } from './app/app.config';
// Composant racine (layout, navigation, router-outlet)
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
