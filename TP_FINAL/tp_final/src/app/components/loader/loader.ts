/**
 * Composant d'indicateur de chargement réutilisable.
 * Affiche un spinner et un message « Chargement… » accessible (role="status").
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Indicateur visuel pendant les appels API -->
    <div class="flex flex-col items-center gap-4 py-16" role="status" aria-label="Chargement">
      <div
        class="h-14 w-14 animate-spin rounded-lg border-4 border-ink border-t-portal shadow-[4px_4px_0_#1a1a1a]"
      ></div>
      <p class="text-sm font-bold tracking-wide text-stone-600">Chargement…</p>
    </div>
  `,
})
export class LoaderComponent {}
