import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { FavorisService } from '../../services/favoris.service';
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-character-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, StatusPipe],
  template: `
    <article class="card">
      <img [src]="character().image" [alt]="character().name" loading="lazy" />
      <div class="card-body">
        <h3>
          <a [routerLink]="['/characters', character().id]">{{ character().name }}</a>
        </h3>
        <p class="meta">{{ character().status | status }} · {{ character().species }}</p>
        <button
          type="button"
          class="fav-btn"
          [class.active]="isFavori()"
          [attr.aria-label]="isFavori() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          (click)="toggleFavori.emit(character())"
        >
          {{ isFavori() ? '★' : '☆' }}
        </button>
      </div>
    </article>
  `,
  styles: `
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
    .card-body {
      padding: 1rem;
    }
    h3 {
      margin: 0 0 0.35rem;
      font-size: 1.1rem;
    }
    h3 a {
      color: var(--text);
      text-decoration: none;
    }
    h3 a:hover {
      color: var(--accent);
    }
    .meta {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .fav-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 2.25rem;
      height: 2.25rem;
      border: none;
      border-radius: 50%;
      background: var(--surface);
      font-size: 1.25rem;
      cursor: pointer;
      box-shadow: var(--shadow);
      line-height: 1;
    }
    .fav-btn.active {
      color: #f5c518;
    }
  `,
})
export class CharacterCardComponent {
  private readonly favorisService = inject(FavorisService);

  readonly character = input.required<Character>();
  readonly toggleFavori = output<Character>();

  readonly isFavori = computed(() =>
    this.favorisService.favoris().some((c) => c.id === this.character().id),
  );
}
