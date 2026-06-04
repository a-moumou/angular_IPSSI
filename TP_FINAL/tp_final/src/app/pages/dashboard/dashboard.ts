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
      <h1 class="page-title">Tableau de bord</h1>
      <p class="page-subtitle">Statistiques de l'univers Rick & Morty</p>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="loadStats()" />
      } @else {
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div class="stat-card group">
            <span class="relative font-display text-4xl font-extrabold text-portal-bright">{{
              totalCharacters()
            }}</span>
            <span class="relative mt-2 block text-sm font-medium text-slate-400">Personnages</span>
          </div>
          <div class="stat-card">
            <span class="relative font-display text-4xl font-extrabold text-cosmic-light">{{
              totalLocations()
            }}</span>
            <span class="relative mt-2 block text-sm font-medium text-slate-400">Lieux</span>
          </div>
          <div class="stat-card">
            <span class="relative font-display text-4xl font-extrabold text-cyan-glow">{{
              totalEpisodes()
            }}</span>
            <span class="relative mt-2 block text-sm font-medium text-slate-400">Épisodes</span>
          </div>
          <div
            class="stat-card border-portal/40 bg-gradient-to-br from-portal/10 to-cosmic/10 ring-1 ring-portal/30"
          >
            <span class="relative font-display text-4xl font-extrabold text-amber-400">{{
              nombreFavoris()
            }}</span>
            <span class="relative mt-2 block text-sm font-medium text-slate-400">Favoris ⭐</span>
          </div>
        </div>

        <div class="glass-panel mt-8 p-6 sm:p-8">
          <h2 class="mb-4 font-display text-xl font-bold text-white">
            Répartition des favoris par statut
          </h2>
          <div class="grid gap-3 sm:grid-cols-3">
            <div
              class="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3"
            >
              <span class="text-2xl">🟢</span>
              <div>
                <p class="text-xs uppercase tracking-wider text-slate-500">Vivants</p>
                <p class="font-display text-2xl font-bold text-emerald-400">
                  {{ repartition().Alive }}
                </p>
              </div>
            </div>
            <div
              class="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3"
            >
              <span class="text-2xl">🔴</span>
              <div>
                <p class="text-xs uppercase tracking-wider text-slate-500">Morts</p>
                <p class="font-display text-2xl font-bold text-red-400">
                  {{ repartition().Dead }}
                </p>
              </div>
            </div>
            <div
              class="flex items-center gap-3 rounded-xl border border-slate-500/20 bg-slate-500/10 px-4 py-3"
            >
              <span class="text-2xl">⚪</span>
              <div>
                <p class="text-xs uppercase tracking-wider text-slate-500">Inconnus</p>
                <p class="font-display text-2xl font-bold text-slate-300">
                  {{ repartition().unknown }}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </section>
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
