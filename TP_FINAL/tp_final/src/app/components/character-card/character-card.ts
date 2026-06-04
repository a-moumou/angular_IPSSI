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
    <article
      class="group relative overflow-hidden rounded-2xl border border-glass-border bg-glass backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-portal/50 hover:shadow-[0_12px_40px_rgb(151_206_76/0.12)]"
    >
      <div
        class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-portal via-cosmic to-cyan-glow opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      ></div>
      <div class="relative aspect-square overflow-hidden">
        <img
          [src]="character().image"
          [alt]="character().name"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-space via-transparent to-transparent opacity-80"
        ></div>
        <button
          type="button"
          class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-space/80 text-xl backdrop-blur-md transition-all hover:scale-110 hover:border-portal/60"
          [class]="
            isFavori()
              ? 'text-amber-400 shadow-[0_0_20px_rgb(251_191_36/0.4)]'
              : 'text-slate-400 hover:text-amber-300'
          "
          [attr.aria-label]="isFavori() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          (click)="toggleFavori.emit(character())"
        >
          {{ isFavori() ? '★' : '☆' }}
        </button>
      </div>
      <div class="relative p-4">
        <h3 class="mb-1 font-display text-lg font-bold leading-tight">
          <a
            [routerLink]="['/characters', character().id]"
            class="text-white no-underline transition-colors hover:text-portal-bright"
            >{{ character().name }}</a
          >
        </h3>
        <p class="text-sm text-slate-400">
          {{ character().status | status }} · {{ character().species }}
        </p>
      </div>
    </article>
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
