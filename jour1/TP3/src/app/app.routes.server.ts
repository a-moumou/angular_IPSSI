/**
 * Stratégie de rendu SSR par route (TP3).
 * La fiche Pokémon est rendue côté serveur ; le reste est pré-généré au build.
 */
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pokemon/:name',
    renderMode: RenderMode.Server,   // Rendu dynamique à la requête (nom variable)
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender, // Pages statiques au build
  },
];
