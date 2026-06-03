import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { LocationService } from '../../services/location.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderComponent, ErrorMessageComponent],
  template: `
    <section class="page">
      <h1>Tableau de bord</h1>
      <p class="subtitle">Statistiques de l'univers Rick & Morty</p>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="loadStats()" />
      } @else {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ totalCharacters() }}</span>
            <span class="stat-label">Personnages</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ totalLocations() }}</span>
            <span class="stat-label">Lieux</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ totalEpisodes() }}</span>
            <span class="stat-label">Épisodes</span>
          </div>
          <div class="stat-card accent">
            <span class="stat-value">{{ nombreFavoris() }}</span>
            <span class="stat-label">Favoris ⭐</span>
          </div>
        </div>

        <div class="favoris-stats">
          <h2>Répartition des favoris par statut</h2>
          <ul>
            <li>🟢 Vivants : {{ repartition().Alive }}</li>
            <li>🔴 Morts : {{ repartition().Dead }}</li>
            <li>⚪ Inconnus : {{ repartition().unknown }}</li>
          </ul>
        </div>
      }
    </section>
  `,
  styles: `
    .subtitle {
      color: var(--text-muted);
      margin-bottom: 2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      text-align: center;
    }
    .stat-card.accent {
      border-color: var(--accent);
      background: color-mix(in srgb, var(--accent) 8%, var(--surface));
    }
    .stat-value {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
    }
    .stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .favoris-stats {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
    }
    .favoris-stats h2 {
      margin-top: 0;
      font-size: 1.1rem;
    }
    .favoris-stats ul {
      margin: 0;
      padding-left: 1.25rem;
      line-height: 1.8;
    }
  `,
})
export class Dashboard implements OnInit {
  private readonly characterService = inject(CharacterService);
  private readonly locationService = inject(LocationService);
  private readonly episodeService = inject(EpisodeService);
  private readonly favorisService = inject(FavorisService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly totalCharacters = signal(0);
  readonly totalLocations = signal(0);
  readonly totalEpisodes = signal(0);

  readonly nombreFavoris = this.favorisService.nombre;
  readonly repartition = this.favorisService.repartitionParStatut;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.error.set(null);

    let completed = 0;
    const done = (): void => {
      completed++;
      if (completed === 3) {
        this.loading.set(false);
      }
    };

    const onErr = (): void => {
      this.error.set('Impossible de charger les statistiques.');
      this.loading.set(false);
    };

    this.characterService.getCount().subscribe({
      next: (n) => {
        this.totalCharacters.set(n);
        done();
      },
      error: onErr,
    });
    this.locationService.getCount().subscribe({
      next: (n) => {
        this.totalLocations.set(n);
        done();
      },
      error: onErr,
    });
    this.episodeService.getCount().subscribe({
      next: (n) => {
        this.totalEpisodes.set(n);
        done();
      },
      error: onErr,
    });
  }
}
