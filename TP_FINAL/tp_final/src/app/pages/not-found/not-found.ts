import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="page flex flex-col items-center py-20 text-center">
      <p class="font-display text-[8rem] font-extrabold leading-none text-portal/30 sm:text-[10rem]">
        404
      </p>
      <h1 class="page-title -mt-8 mb-4">Dimension introuvable</h1>
      <p class="mb-8 max-w-md text-slate-400">
        Cette page n'existe pas dans cet univers — ou Rick l'a encore effacée.
      </p>
      <a routerLink="/dashboard" class="btn-primary no-underline">Retour au tableau de bord</a>
    </section>
  `,
})
export class NotFound {}
