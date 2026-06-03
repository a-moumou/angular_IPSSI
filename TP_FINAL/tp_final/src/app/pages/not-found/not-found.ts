import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="page not-found">
      <h1>404</h1>
      <p>Page introuvable dans cette dimension.</p>
      <a routerLink="/dashboard" class="btn btn-primary">Retour au tableau de bord</a>
    </section>
  `,
  styles: `
    .not-found {
      text-align: center;
      padding: 4rem 1rem;
    }
    .not-found h1 {
      font-size: 5rem;
      margin: 0;
      color: var(--accent);
    }
    .not-found p {
      margin: 1rem 0 2rem;
      color: var(--text-muted);
    }
  `,
})
export class NotFound {}
