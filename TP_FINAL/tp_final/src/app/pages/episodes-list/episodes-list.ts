import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EpisodeService } from '../../services/episode.service';
import { Episode } from '../../models/episode.model';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-episodes-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PaginatorComponent, LoaderComponent, ErrorMessageComponent, TruncatePipe],
  template: `
    <section class="page">
      <h1 class="page-title">Épisodes</h1>
      <p class="page-subtitle">Toutes les aventures interdimensionnelles</p>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="load()" />
      } @else {
        <div class="flex flex-col gap-3">
          @for (ep of episodes(); track ep.id) {
            <a [routerLink]="['/episodes', ep.id]" class="list-row flex gap-4 no-underline sm:gap-6">
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cosmic/30 to-portal/20 font-display text-xs font-bold text-portal-bright ring-1 ring-portal/30"
                >{{ ep.episode }}</span
              >
              <div class="min-w-0 flex-1">
                <h3 class="font-display font-bold text-white">{{ ep.name | truncate:60 }}</h3>
                <p class="mt-1 text-sm text-slate-500">{{ ep.air_date }}</p>
              </div>
              <span class="hidden self-center text-portal-bright sm:inline">→</span>
            </a>
          }
        </div>
        <app-paginator
          [currentPage]="currentPage()"
          [totalPages]="totalPages()"
          (prev)="goPrev()"
          (next)="goNext()"
        />
      }
    </section>
  `,
})
export class EpisodesList implements OnInit {
  private readonly episodeService = inject(EpisodeService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly episodes = signal<Episode[]>([]);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.episodeService.getAll(this.currentPage()).subscribe({
      next: (res) => {
        this.episodes.set(res.results);
        this.totalPages.set(res.info.pages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des épisodes.');
        this.loading.set(false);
      },
    });
  }

  goPrev(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.load();
    }
  }

  goNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.load();
    }
  }
}
