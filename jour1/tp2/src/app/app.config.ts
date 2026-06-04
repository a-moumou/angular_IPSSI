/**
 * Configuration minimale de l'application TodoList.
 * Active l'écoute des erreurs globales dans le navigateur.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Capture les erreurs non gérées côté client
    
  ]
};
