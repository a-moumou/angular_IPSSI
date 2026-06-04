/**
 * Routes et modes de rendu pour le serveur Angular (SSR).
 * Indique comment pré-rendre ou rendre chaque chemin côté serveur.
 */
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',                        // Toutes les URLs
    renderMode: RenderMode.Prerender   // Génération statique au build
  }
];
