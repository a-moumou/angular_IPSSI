import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center gap-4 py-16" role="status" aria-label="Chargement">
      <div
        class="h-14 w-14 animate-spin rounded-full border-4 border-glass-border border-t-portal shadow-[0_0_30px_rgb(151_206_76/0.3)]"
      ></div>
      <p class="text-sm font-medium tracking-wide text-slate-400">Chargement du portail…</p>
    </div>
  `,
})
export class LoaderComponent {}
