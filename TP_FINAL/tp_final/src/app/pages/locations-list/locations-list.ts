import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location.model';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';
@Component({
  selector: 'app-locations-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PaginatorComponent, LoaderComponent, ErrorMessageComponent],
  template: `
    <section class="page">
      <h1>Lieux</h1>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="load()" />
      } @else {
        <div class="list">
          @for (loc of locations(); track loc.id) {
            <a class="list-item" [routerLink]="['/locations', loc.id]">
              <h3>{{ loc.name }}</h3>
              <p>{{ loc.type }} · {{ loc.dimension }}</p>
              <p class="muted">{{ loc.residents.length }} résident(s)</p>
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
      display: block;
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
    .list-item h3 {
      margin: 0 0 0.25rem;
    }
    .list-item p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .muted {
      font-size: 0.8rem !important;
    }
  `,
})
export class LocationsList implements OnInit {
  private readonly locationService = inject(LocationService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly locations = signal<Location[]>([]);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.locationService.getAll(this.currentPage()).subscribe({
      next: (res) => {
        this.locations.set(res.results);
        this.totalPages.set(res.info.pages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des lieux.');
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
