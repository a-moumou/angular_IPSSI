/**
 * Configuration spécifique au rendu serveur (SSR).
 * Fusionne la config navigateur avec les providers Angular SSR.
 */

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
// provideServerRendering : active le moteur de rendu côté Node
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

// mergeApplicationConfig : une seule config pour client + serveur
export const config = mergeApplicationConfig(appConfig, serverConfig);
