/**
 * Définition des routes de l'application.
 * Chaque page est chargée en lazy loading pour alléger le bundle initial.
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirection de la racine vers le tableau de bord
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./pages/characters-list/characters-list').then((m) => m.CharactersList),
  },
  {
    // :id lié à l'input id() du composant CharacterDetail (withComponentInputBinding)
    path: 'characters/:id',
    loadComponent: () =>
      import('./pages/character-detail/character-detail').then((m) => m.CharacterDetail),
  },
  {
    path: 'locations',
    loadComponent: () =>
      import('./pages/locations-list/locations-list').then((m) => m.LocationsList),
  },
  {
    path: 'locations/:id',
    loadComponent: () =>
      import('./pages/location-detail/location-detail').then((m) => m.LocationDetail),
  },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./pages/episodes-list/episodes-list').then((m) => m.EpisodesList),
  },
  {
    path: 'episodes/:id',
    loadComponent: () =>
      import('./pages/episode-detail/episode-detail').then((m) => m.EpisodeDetail),
  },
  {
    path: 'favoris',
    loadComponent: () =>
      import('./pages/favoris/favoris').then((m) => m.Favoris),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    // Route catch-all : page 404 personnalisée
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
