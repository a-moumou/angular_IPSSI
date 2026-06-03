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
          <h1>{{ ep.name }}</h1>
          <p class="meta">{{ ep.episode }} · {{ ep.air_date }}</p>

          <h2>Personnages ({{ characters().length }})</h2>
          @if (charactersLoading()) {
            <app-loader />
          } @else if (characters().length === 0) {
            <p class="empty">Aucun personnage listé.</p>
          } @else {
            <div class="grid">
              @for (c of characters(); track c.id) {
                <app-character-card
                  [character]="c"
                  (toggleFavori)="onToggleFavori($event)"
                />
              }
            </div>
          }
        }
      }
    </section>
  `,
  styles: `
    .meta {
      color: var(--text-muted);
      margin-bottom: 2rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }
    .empty {
      color: var(--text-muted);
    }
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
