/**
 * Point d'entrée pour le rendu côté serveur (SSR).
 * Exporte une fonction bootstrap utilisée par le moteur Node Angular.
 */

// BootstrapContext : contexte SSR passé par la plateforme serveur
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
// Config fusionnée : app client + providers de rendu serveur
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
