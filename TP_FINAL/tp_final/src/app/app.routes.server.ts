import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'characters',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'locations',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'episodes',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'characters/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'locations/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'episodes/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'favoris',
    renderMode: RenderMode.Server,
  },
  {
    path: 'contact',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
