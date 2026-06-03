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
          <div class="detail-header">
            <img [src]="c.image" [alt]="c.name" />
            <div>
              <h1>{{ c.name }}</h1>
              <p>{{ c.status | status }} · {{ c.species }} · {{ c.gender }}</p>
              <p><strong>Type :</strong> {{ c.type || '—' }}</p>
              <button type="button" class="btn btn-secondary" (click)="toggleFavori()">
                {{ isFavori() ? '★ Retirer des favoris' : '☆ Ajouter aux favoris' }}
              </button>
            </div>
          </div>

          <div class="relations">
            <h2>Origine & lieu actuel</h2>
            <ul class="link-list">
              <li>
                <strong>Origine :</strong>
                @if (originLocationId(); as locId) {
                  <a [routerLink]="['/locations', locId]">{{ c.origin.name }}</a>
                } @else {
                  {{ c.origin.name }}
                }
              </li>
              <li>
                <strong>Lieu actuel :</strong>
                @if (currentLocationId(); as locId) {
                  <a [routerLink]="['/locations', locId]">{{ c.location.name }}</a>
                } @else {
                  {{ c.location.name }}
                }
              </li>
            </ul>

            <h2>Épisodes ({{ episodes().length }})</h2>
            @if (episodesLoading()) {
              <app-loader />
            } @else {
              <div class="episode-grid">
                @for (ep of episodes(); track ep.id) {
                  <a class="episode-card" [routerLink]="['/episodes', ep.id]">
                    <strong>{{ ep.episode }}</strong>
                    <span>{{ ep.name }}</span>
                  </a>
                }
              </div>
            }
          </div>
        }
      }
    </section>
  `,
  styles: `
    .detail-header {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }
    .detail-header img {
      width: 220px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }
    .relations h2 {
      margin-top: 1.5rem;
      font-size: 1.15rem;
    }
    .link-list {
      list-style: none;
      padding: 0;
      line-height: 1.8;
    }
    .link-list a {
      color: var(--accent);
    }
    .episode-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    .episode-card {
      display: flex;
      flex-direction: column;
      padding: 0.85rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      text-decoration: none;
      color: var(--text);
      transition: border-color 0.2s;
    }
    .episode-card:hover {
      border-color: var(--accent);
    }
    .episode-card strong {
      color: var(--accent);
      font-size: 0.85rem;
    }
  `,
})
export class CharacterDetail implements OnInit {
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
