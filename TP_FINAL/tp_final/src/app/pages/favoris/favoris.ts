/**
 * Page des favoris stockés localement (FavorisService + localStorage).
 * Affiche une grille de cartes ou un message vide avec lien vers les personnages.
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris.service';
import { CharacterCardComponent } from '../../components/character-card/character-card';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-favoris',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CharacterCardComponent],
  template: `
    <section class="page">
      <h1 class="page-title">Mes favoris ⭐</h1>
      <p class="page-subtitle">
        {{ nombre() }} personnage(s) — sauvegardés dans ton navigateur
      </p>

      @if (favoris().length === 0) {
        <!-- État vide : invitation à parcourir le catalogue -->
        <div
          class="glass-panel flex flex-col items-center gap-4 py-16 text-center"
        >
          <span class="text-5xl opacity-60">☆</span>
          <p class="text-stone-600">Aucun favori pour le moment.</p>
          <a routerLink="/characters" class="btn-primary no-underline"
            >Parcourir les personnages</a
          >
        </div>
      } @else {
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          @for (c of favoris(); track c.id) {
            <app-character-card [character]="c" (toggleFavori)="onToggle($event)" />
          }
        </div>
      }
    </section>
  `,
})
export class Favoris {
  private readonly favorisService = inject(FavorisService);

  readonly favoris = this.favorisService.favoris;
  readonly nombre = this.favorisService.nombre;

  onToggle(character: Character): void {
    this.favorisService.toggle(character);
  }
}
