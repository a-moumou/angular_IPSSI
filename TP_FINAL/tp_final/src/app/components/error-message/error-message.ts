/**
 * Bloc d'erreur avec message personnalisable et bouton « Réessayer ».
 * Utilise input() pour le texte et output() pour notifier le parent.
 */

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-xl border-2 border-ink bg-red-100 p-8 text-center shadow-[6px_6px_0_#1a1a1a]"
      role="alert"
    >
      <p class="mb-2 text-3xl">⚠️</p>
      <p class="mb-5 font-bold text-red-800">{{ message() }}</p>
      <button type="button" class="btn-secondary" (click)="retry.emit()">Réessayer</button>
    </div>
  `,
})
export class ErrorMessageComponent {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
