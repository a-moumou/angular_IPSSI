import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-box" role="alert">
      <p>{{ message() }}</p>
      <button type="button" class="btn btn-secondary" (click)="retry.emit()">
        Réessayer
      </button>
    </div>
  `,
  styles: `
    .error-box {
      text-align: center;
      padding: 2rem;
      background: color-mix(in srgb, var(--danger) 12%, transparent);
      border: 1px solid var(--danger);
      border-radius: var(--radius);
      color: var(--danger);
    }
    .error-box p {
      margin-bottom: 1rem;
    }
  `,
})
export class ErrorMessageComponent {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
