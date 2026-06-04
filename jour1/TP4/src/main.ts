/**
 * Point d'entrée de l'application Angular côté navigateur.
 * Démarre le composant racine avec la configuration globale.
 */
// Bootstrap Angular pour le navigateur
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Lance l'application et affiche les erreurs éventuelles dans la console
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
