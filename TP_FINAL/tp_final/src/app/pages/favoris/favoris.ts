import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris.service';
import { CharacterCardComponent } from '../../components/character-card/character-card';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-favoris',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CharacterCardComponent],
  template: `
    <section class="page">
      <h1>Mes favoris ⭐</h1>
      <p class="subtitle">{{ nombre() }} personnage(s) en favori — persistés dans le navigateur</p>

      @if (favoris().length === 0) {
        <p class="empty">
          Aucun favori pour le moment.
          <a routerLink="/characters">Parcourir les personnages</a>
        </p>
      } @else {
        <div class="grid">
          @for (c of favoris(); track c.id) {
            <app-character-card
              [character]="c"
              (toggleFavori)="onToggle($event)"
            />
          }
        </div>
      }
    </section>
  `,
  styles: `
    .subtitle {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }
    .empty {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
    }
    .empty a {
      color: var(--accent);
    }
  `,
})
export class Favoris {
  private readonly favorisService = inject(FavorisService);

  readonly favoris = this.favorisService.favoris;
  readonly nombre = this.favorisService.nombre;

  onToggle(character: Character): void {
    this.favorisService.toggle(character);
  }
}
