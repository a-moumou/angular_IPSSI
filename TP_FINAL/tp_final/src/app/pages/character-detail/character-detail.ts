/**
 * Fiche détail d'un personnage (route characters/:id).
 * Charge le personnage REST puis ses épisodes ; liens vers lieux et favoris.
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { Episode } from '../../models/episode.model';
import { CharacterService } from '../../services/character.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';
import { extractIdFromUrl } from '../../utils/url-id.util';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-character-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent, StatusPipe],
  template: `
    <section class="page">
      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="load()" />
      } @else {
        @if (character(); as c) {
          <div class="glass-panel mb-8 flex flex-wrap gap-8 p-6 sm:p-8">
            <img
              [src]="c.image"
              [alt]="c.name"
              class="h-56 w-56 shrink-0 rounded-xl border-2 border-ink object-cover shadow-[6px_6px_0_#1a1a1a] sm:h-64 sm:w-64"
            />
            <div class="min-w-0 flex-1">
              <h1 class="page-title mb-3">{{ c.name }}</h1>
              <p class="mb-4 text-lg text-stone-700">
                {{ c.status | status }} · {{ c.species }} · {{ c.gender }}
              </p>
              <p class="mb-6 text-stone-600">
                <span class="font-bold text-ink">Type :</span>
                {{ c.type || '—' }}
              </p>
              <button type="button" class="btn-primary" (click)="toggleFavori()">
                {{ isFavori() ? '★ Retirer des favoris' : '☆ Ajouter aux favoris' }}
              </button>
            </div>
          </div>

          <div class="space-y-8">
            <div class="glass-panel p-6 sm:p-8">
              <h2 class="mb-4 font-display text-2xl text-ink">
                Origine & lieu actuel
              </h2>
              <ul class="space-y-3 text-stone-700">
                <li class="flex flex-wrap gap-2">
                  <span class="font-bold text-stone-600">Origine :</span>
                  @if (originLocationId(); as locId) {
                    <a [routerLink]="['/locations', locId]" class="link-portal">{{ c.origin.name }}</a>
                  } @else {
                    {{ c.origin.name }}
                  }
                </li>
                <li class="flex flex-wrap gap-2">
                  <span class="font-bold text-stone-600">Lieu actuel :</span>
                  @if (currentLocationId(); as locId) {
                    <a [routerLink]="['/locations', locId]" class="link-portal">{{ c.location.name }}</a>
                  } @else {
                    {{ c.location.name }}
                  }
                </li>
              </ul>
            </div>

            <div>
              <h2 class="mb-4 font-display text-2xl text-ink">
                Épisodes
                <span class="ml-2 text-base font-sans font-bold text-portal-dark"
                  >({{ episodes().length }})</span
                >
              </h2>
              @if (episodesLoading()) {
                <app-loader />
              } @else {
                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  @for (ep of episodes(); track ep.id) {
                    <a [routerLink]="['/episodes', ep.id]" class="episode-tile text-ink">
                      <strong class="text-sm font-bold text-portal-dark">{{ ep.episode }}</strong>
                      <span class="text-sm text-stone-600">{{ ep.name }}</span>
                    </a>
                  }
                </div>
              }
            </div>
          </div>
        }
      }
    </section>
  `,
})
export class CharacterDetail implements OnInit {
  // Paramètre de route lié via withComponentInputBinding
  readonly id = input.required<string>();

  private readonly characterService = inject(CharacterService);
  private readonly episodeService = inject(EpisodeService);
  private readonly favorisService = inject(FavorisService);

  readonly loading = signal(true);
  readonly episodesLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly character = signal<Character | null>(null);
  readonly episodes = signal<Episode[]>([]);
  readonly originLocationId = signal<number | null>(null);
  readonly currentLocationId = signal<number | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const numId = Number(this.id());
    this.loading.set(true);
    this.error.set(null);

    this.characterService.getById(numId).subscribe({
      next: (c) => {
        this.character.set(c);
        this.originLocationId.set(extractIdFromUrl(c.origin.url));
        this.currentLocationId.set(extractIdFromUrl(c.location.url));
        this.loading.set(false);
        this.loadEpisodes(c);
      },
      error: () => {
        this.error.set('Personnage introuvable.');
        this.loading.set(false);
      },
    });
  }

  isFavori(): boolean {
    const c = this.character();
    return c ? this.favorisService.isFavori(c.id) : false;
  }

  toggleFavori(): void {
    const c = this.character();
    if (c) {
      this.favorisService.toggle(c);
    }
  }

  private loadEpisodes(character: Character): void {
    const ids = character.episode
      .map((url) => extractIdFromUrl(url))
      .filter((id): id is number => id !== null);

    if (ids.length === 0) {
      return;
    }

    this.episodesLoading.set(true);
    this.episodeService.getMany(ids).subscribe({
      next: (eps) => {
        this.episodes.set(eps);
        this.episodesLoading.set(false);
      },
      error: () => this.episodesLoading.set(false),
    });
  }
}
