/**
 * Carte personnage : image, nom cliquable, statut, bouton favori.
 * Réutilisée dans les listes, favoris et pages de détail liées.
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { FavorisService } from '../../services/favoris.service';
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-character-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, StatusPipe],
  template: `
    <article
      class="group relative overflow-hidden rounded-xl border-2 border-ink bg-white shadow-[6px_6px_0_#1a1a1a] transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_#1a1a1a]"
    >
      <div
        class="absolute inset-x-0 top-0 h-2 bg-cyan-glow opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      ></div>
      <div class="relative aspect-square overflow-hidden border-b-2 border-ink">
        <img
          [src]="character().image"
          [alt]="character().name"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <!-- Bouton favori : émet toggleFavori vers le parent -->
        <button
          type="button"
          class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-white text-xl shadow-[3px_3px_0_#1a1a1a] transition-all hover:scale-110"
          [class]="
            isFavori()
              ? 'bg-cyan-glow text-portal-dark'
              : 'text-stone-500 hover:bg-cyan-glow/50'
          "
          [attr.aria-label]="isFavori() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          (click)="toggleFavori.emit(character())"
        >
          {{ isFavori() ? '★' : '☆' }}
        </button>
      </div>
      <div class="relative p-4">
        <h3 class="mb-1 font-display text-lg font-bold leading-tight">
          <a
            [routerLink]="['/characters', character().id]"
            class="text-ink no-underline transition-colors hover:text-portal-dark"
            >{{ character().name }}</a
          >
        </h3>
        <p class="text-sm text-stone-600">
          {{ character().status | status }} · {{ character().species }}
        </p>
      </div>
    </article>
  `,
})
export class CharacterCardComponent {
  private readonly favorisService = inject(FavorisService);

  readonly character = input.required<Character>();
  readonly toggleFavori = output<Character>();

  readonly isFavori = computed(() =>
    this.favorisService.favoris().some((c) => c.id === this.character().id),
  );
}
