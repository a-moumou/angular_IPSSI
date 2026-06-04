/**
 * Stratégie SSR par route : client pour le détail (id dynamique), pré-rendu ailleurs.
 */
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'carte/:id',
    renderMode: RenderMode.Client, // Id inconnu au build → rendu côté client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  }
];
