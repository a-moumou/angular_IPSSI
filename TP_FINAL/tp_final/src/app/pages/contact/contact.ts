import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page contact-page">
      <h1>Contact</h1>
      <p class="subtitle">Formulaire réactif avec validation</p>

      @if (submitted()) {
        <div class="success" role="status">
          Merci ! Votre message a bien été envoyé (simulation).
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="nom">Nom</label>
          <input id="nom" type="text" formControlName="nom" />
          @if (form.controls.nom.touched && form.controls.nom.errors?.['required']) {
            <span class="error">Le nom est obligatoire.</span>
          }
          @if (form.controls.nom.touched && form.controls.nom.errors?.['minlength']) {
            <span class="error">Minimum 3 caractères.</span>
          }
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          @if (form.controls.email.touched && form.controls.email.errors?.['required']) {
            <span class="error">L'email est obligatoire.</span>
          }
          @if (form.controls.email.touched && form.controls.email.errors?.['email']) {
            <span class="error">Format d'email invalide.</span>
          }
        </div>

        <div class="field">
          <label for="message">Message</label>
          <textarea id="message" rows="5" formControlName="message"></textarea>
          @if (form.controls.message.touched && form.controls.message.errors?.['required']) {
            <span class="error">Le message est obligatoire.</span>
          }
          @if (form.controls.message.touched && form.controls.message.errors?.['minlength']) {
            <span class="error">Minimum 10 caractères.</span>
          }
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
          Envoyer
        </button>
      </form>
    </section>
  `,
  styles: `
    .contact-page {
      max-width: 520px;
    }
    .subtitle {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    label {
      font-size: 0.9rem;
      font-weight: 500;
    }
    input,
    textarea {
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      font: inherit;
    }
    .error {
      font-size: 0.85rem;
      color: var(--danger);
    }
    .success {
      padding: 1rem;
      margin-bottom: 1rem;
      background: color-mix(in srgb, #22c55e 15%, transparent);
      border: 1px solid #22c55e;
      border-radius: var(--radius);
      color: #166534;
    }
  `,
})
export class Contact {
  private readonly fb = inject(FormBuilder);

  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.set(true);
    this.form.reset();
  }
}
