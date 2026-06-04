/**
 * Stratégie de rendu SSR : pré-rendu de toutes les pages au build.
 */
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender // Toutes les URLs en mode pré-rendu
  }
];
