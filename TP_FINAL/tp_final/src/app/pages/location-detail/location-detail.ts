import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { LocationService } from '../../services/location.service';
import { CharacterService } from '../../services/character.service';
import { Location } from '../../models/location.model';
import { Character } from '../../models/character.model';
import { extractIdFromUrl } from '../../utils/url-id.util';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';
import { CharacterCardComponent } from '../../components/character-card/character-card';
import { FavorisService } from '../../services/favoris.service';

@Component({
  selector: 'app-location-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoaderComponent,
    ErrorMessageComponent,
    CharacterCardComponent,
  ],
  template: `
    <section class="page">
      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="load()" />
      } @else {
        @if (location(); as loc) {
          <h1>{{ loc.name }}</h1>
          <p class="meta">{{ loc.type }} · Dimension : {{ loc.dimension }}</p>

          <h2>Résidents ({{ residents().length }})</h2>
          @if (residentsLoading()) {
            <app-loader />
          } @else if (residents().length === 0) {
            <p class="empty">Aucun résident connu.</p>
          } @else {
            <div class="grid">
              @for (c of residents(); track c.id) {
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
export class LocationDetail implements OnInit {
  readonly id = input.required<string>();

  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);
  private readonly favorisService = inject(FavorisService);

  readonly loading = signal(true);
  readonly residentsLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly location = signal<Location | null>(null);
  readonly residents = signal<Character[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const numId = Number(this.id());
    this.loading.set(true);
    this.error.set(null);

    this.locationService.getById(numId).subscribe({
      next: (loc) => {
        this.location.set(loc);
        this.loading.set(false);
        this.loadResidents(loc);
      },
      error: () => {
        this.error.set('Lieu introuvable.');
        this.loading.set(false);
      },
    });
  }

  onToggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }

  private loadResidents(location: Location): void {
    const ids = location.residents
      .map((url) => extractIdFromUrl(url))
      .filter((id): id is number => id !== null);

    if (ids.length === 0) {
      return;
    }

    this.residentsLoading.set(true);
    this.characterService.getMany(ids).subscribe({
      next: (chars) => {
        this.residents.set(chars);
        this.residentsLoading.set(false);
      },
      error: () => this.residentsLoading.set(false),
    });
  }
}
