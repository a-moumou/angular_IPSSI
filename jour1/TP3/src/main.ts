/**
 * Point d'entrée de l'application Pokédex (TP3) côté navigateur.
 * Démarre le composant racine avec routeur, HTTP et hydratation.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
