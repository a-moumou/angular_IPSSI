import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center backdrop-blur-sm"
      role="alert"
    >
      <p class="mb-2 text-3xl">⚠️</p>
      <p class="mb-5 font-medium text-red-300">{{ message() }}</p>
      <button type="button" class="btn-secondary" (click)="retry.emit()">Réessayer</button>
    </div>
  `,
})
export class ErrorMessageComponent {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
