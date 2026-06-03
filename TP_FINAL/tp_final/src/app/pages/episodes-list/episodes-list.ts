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
      <h1>Épisodes</h1>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="load()" />
      } @else {
        <div class="list">
          @for (ep of episodes(); track ep.id) {
            <a class="list-item" [routerLink]="['/episodes', ep.id]">
              <span class="code">{{ ep.episode }}</span>
              <div>
                <h3>{{ ep.name | truncate:60 }}</h3>
                <p>{{ ep.air_date }}</p>
              </div>
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
  styles: `
    .list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .list-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem 1.25rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      text-decoration: none;
      color: var(--text);
      transition: border-color 0.2s;
    }
    .list-item:hover {
      border-color: var(--accent);
    }
    .code {
      font-weight: 700;
      color: var(--accent);
      min-width: 4rem;
    }
    .list-item h3 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
    }
    .list-item p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
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
