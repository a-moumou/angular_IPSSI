/**
 * Point d'entrée pour le rendu côté serveur (SSR).
 * Exporte une fonction de bootstrap utilisée par le moteur Node.
 */
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// Fonction appelée par le serveur avec le contexte SSR
const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
