/**
 * Liste paginée des lieux (dimensions, planètes).
 * Chaque ligne mène vers la page de détail locations/:id.
 */

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
      <h1 class="page-title">Lieux</h1>
      <p class="page-subtitle">Explorez les dimensions et planètes</p>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="load()" />
      } @else {
        <div class="flex flex-col gap-3">
          @for (loc of locations(); track loc.id) {
            <a [routerLink]="['/locations', loc.id]" class="list-row no-underline">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <h3 class="font-display text-xl text-ink">{{ loc.name }}</h3>
                <span class="badge-pill text-[0.65rem]">{{ loc.residents.length }} résidents</span>
              </div>
              <p class="mt-1 text-sm text-stone-600">{{ loc.type }} · {{ loc.dimension }}</p>
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
