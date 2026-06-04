/**
 * Composant racine de l'application Rick & Morty Explorer.
 * Affiche la navigation principale, le badge favoris et le router-outlet des pages.
 */

import { Component, computed, inject } from '@angular/core';
// RouterLink / RouterLinkActive : liens et état actif dans la barre de nav
// RouterOutlet : zone où s'affichent les pages lazy-loaded
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FavorisService } from './services/favoris.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly favorisService = inject(FavorisService);

  // Signal dérivé du service : nombre de personnages en favoris
  readonly nombreFavoris = this.favorisService.nombre;
  // computed : texte du badge uniquement si au moins un favori
  readonly badgeFavoris = computed(() =>
    this.nombreFavoris() > 0 ? String(this.nombreFavoris()) : '',
  );
}
