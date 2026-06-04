/**
 * Pagination simple : page courante, total, boutons précédent / suivant.
 * Le parent gère la logique ; ce composant n'émet que prev et next.
 */

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
      aria-label="Pagination"
    >
      <button
        type="button"
        class="btn-secondary"
        [disabled]="currentPage() <= 1"
        (click)="prev.emit()"
      >
        ← Précédent
      </button>
      <span
        class="rounded-lg border-2 border-ink bg-cyan-glow/40 px-5 py-2 text-sm font-bold text-ink shadow-[3px_3px_0_#1a1a1a]"
      >
        Page <span class="text-portal-dark">{{ currentPage() }}</span> /
        {{ totalPages() }}
      </span>
      <button
        type="button"
        class="btn-secondary"
        [disabled]="currentPage() >= totalPages()"
        (click)="next.emit()"
      >
        Suivant →
      </button>
    </nav>
  `,
})
export class PaginatorComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly prev = output<void>();
  readonly next = output<void>();
}
