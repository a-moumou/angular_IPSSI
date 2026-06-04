/**
 * Détail d'un épisode et liste des personnages qui y apparaissent.
 * Charge l'épisode puis résout les URLs characters en personnages complets.
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { EpisodeService } from '../../services/episode.service';
import { CharacterService } from '../../services/character.service';
import { Episode } from '../../models/episode.model';
import { Character } from '../../models/character.model';
import { extractIdFromUrl } from '../../utils/url-id.util';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';
import { CharacterCardComponent } from '../../components/character-card/character-card';
import { FavorisService } from '../../services/favoris.service';

@Component({
  selector: 'app-episode-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderComponent, ErrorMessageComponent, CharacterCardComponent],
  template: `
    <section class="page">
      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="load()" />
      } @else {
        @if (episode(); as ep) {
          <div class="mb-8">
            <span class="badge-pill mb-3">{{ ep.episode }}</span>
            <h1 class="page-title">{{ ep.name }}</h1>
            <p class="mt-2 text-stone-600">{{ ep.air_date }}</p>
          </div>

          <h2 class="mb-5 font-display text-2xl text-ink">
            Personnages
            <span class="text-portal-dark">({{ characters().length }})</span>
          </h2>
          @if (charactersLoading()) {
            <app-loader />
          } @else if (characters().length === 0) {
            <p class="text-stone-600">Aucun personnage listé.</p>
          } @else {
            <div
              class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            >
              @for (c of characters(); track c.id) {
                <app-character-card [character]="c" (toggleFavori)="onToggleFavori($event)" />
              }
            </div>
          }
        }
      }
    </section>
  `,
})
export class EpisodeDetail implements OnInit {
  readonly id = input.required<string>();

  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);
  private readonly favorisService = inject(FavorisService);

  readonly loading = signal(true);
  readonly charactersLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly episode = signal<Episode | null>(null);
  readonly characters = signal<Character[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const numId = Number(this.id());
    this.loading.set(true);
    this.error.set(null);

    this.episodeService.getById(numId).subscribe({
      next: (ep) => {
        this.episode.set(ep);
        this.loading.set(false);
        this.loadCharacters(ep);
      },
      error: () => {
        this.error.set('Épisode introuvable.');
        this.loading.set(false);
      },
    });
  }

  onToggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }

  private loadCharacters(episode: Episode): void {
    const ids = episode.characters
      .map((url) => extractIdFromUrl(url))
      .filter((id): id is number => id !== null);

    if (ids.length === 0) {
      return;
    }

    this.charactersLoading.set(true);
    this.characterService.getMany(ids).subscribe({
      next: (chars) => {
        this.characters.set(chars);
        this.charactersLoading.set(false);
      },
      error: () => this.charactersLoading.set(false),
    });
  }
}
