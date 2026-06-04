/**
 * Point d'entrée de la TodoList Angular (TP2).
 * Démarre l'application avec le composant racine et sa configuration.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
