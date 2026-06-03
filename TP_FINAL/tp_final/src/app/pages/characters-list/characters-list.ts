import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Character } from '../../models/character.model';
import { ApiResponse } from '../../models/api-response.model';
import { CharacterService } from '../../services/character.service';
import { FavorisService } from '../../services/favoris.service';
import { CharacterCardComponent } from '../../components/character-card/character-card';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';

@Component({
  selector: 'app-characters-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CharacterCardComponent,
    SearchBarComponent,
    PaginatorComponent,
    LoaderComponent,
    ErrorMessageComponent,
  ],
  template: `
    <section class="page">
      <h1>Personnages</h1>

      <div class="filters">
        <app-search-bar (searchChange)="onSearch($event)" />
        <div class="status-filter">
          <label for="status">Statut</label>
          <select id="status" [(ngModel)]="statusFilter" (ngModelChange)="onStatusChange()">
            <option value="">Tous</option>
            <option value="alive">Vivant</option>
            <option value="dead">Mort</option>
            <option value="unknown">Inconnu</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="reload()" />
      } @else {
        @if (characters().length === 0) {
          <p class="empty">Aucun personnage trouvé.</p>
        } @else {
          <div class="grid">
            @for (c of characters(); track c.id) {
              <app-character-card
                [character]="c"
                (toggleFavori)="onToggleFavori($event)"
              />
            }
          </div>
          <app-paginator
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            (prev)="goPrev()"
            (next)="goNext()"
          />
        }
      }
    </section>
  `,
  styles: `
    .filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      align-items: flex-end;
    }
    .status-filter {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .status-filter label {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    select {
      padding: 0.6rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      min-width: 140px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }
    .empty {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem;
    }
  `,
})
export class CharactersList implements OnInit {
  private readonly characterService = inject(CharacterService);
  private readonly favorisService = inject(FavorisService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly search$ = new Subject<{ page: number; name: string; status: string }>();

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly characters = signal<Character[]>([]);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  searchTerm = '';
  statusFilter = '';

  ngOnInit(): void {
    this.search$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        debounceTime(300),
        distinctUntilChanged(
          (a, b) => a.page === b.page && a.name === b.name && a.status === b.status,
        ),
        switchMap(({ page, name, status }) =>
          this.characterService
            .getAll(page, name || undefined, status || undefined)
            .pipe(
              catchError(() => {
                this.error.set('Erreur lors du chargement des personnages.');
                this.loading.set(false);
                return of(null);
              }),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.loading.set(false);
        if (!response) {
          this.characters.set([]);
          return;
        }
        this.applyResponse(response);
      });

    this.emitSearch();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage.set(1);
    this.emitSearch();
  }

  onStatusChange(): void {
    this.currentPage.set(1);
    this.emitSearch();
  }

  goPrev(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.emitSearch();
    }
  }

  goNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.emitSearch();
    }
  }

  reload(): void {
    this.emitSearch();
  }

  onToggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }

  private emitSearch(): void {
    this.search$.next({
      page: this.currentPage(),
      name: this.searchTerm,
      status: this.statusFilter,
    });
  }

  private applyResponse(response: ApiResponse<Character>): void {
    this.characters.set(response.results);
    this.totalPages.set(response.info.pages || 1);
  }
}
