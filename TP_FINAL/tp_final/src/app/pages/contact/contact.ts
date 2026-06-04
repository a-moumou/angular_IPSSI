/**
 * Page contact avec formulaire réactif (ReactiveFormsModule).
 * Validation nom, email et message ; envoi simulé côté client uniquement.
 */

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page max-w-lg">
      <h1 class="page-title">Contact</h1>
      <p class="page-subtitle">Formulaire réactif avec validation</p>

      @if (submitted()) {
        <div
          class="mb-6 rounded-lg border-2 border-ink bg-emerald-100 px-5 py-4 font-bold text-emerald-800 shadow-[4px_4px_0_#1a1a1a]"
          role="status"
        >
          Merci ! Votre message a bien été envoyé (simulation).
        </div>
      }

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="glass-panel flex flex-col gap-5 p-6 sm:p-8"
      >
        <div class="flex flex-col gap-2">
          <label for="nom" class="label-field">Nom</label>
          <input id="nom" type="text" formControlName="nom" class="input-field" />
          @if (form.controls.nom.touched && form.controls.nom.errors?.['required']) {
            <span class="text-sm text-red-700">Le nom est obligatoire.</span>
          }
          @if (form.controls.nom.touched && form.controls.nom.errors?.['minlength']) {
            <span class="text-sm text-red-700">Minimum 3 caractères.</span>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="email" class="label-field">Email</label>
          <input id="email" type="email" formControlName="email" class="input-field" />
          @if (form.controls.email.touched && form.controls.email.errors?.['required']) {
            <span class="text-sm text-red-700">L'email est obligatoire.</span>
          }
          @if (form.controls.email.touched && form.controls.email.errors?.['email']) {
            <span class="text-sm text-red-700">Format d'email invalide.</span>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="message" class="label-field">Message</label>
          <textarea
            id="message"
            rows="5"
            formControlName="message"
            class="input-field resize-y"
          ></textarea>
          @if (form.controls.message.touched && form.controls.message.errors?.['required']) {
            <span class="text-sm text-red-700">Le message est obligatoire.</span>
          }
          @if (form.controls.message.touched && form.controls.message.errors?.['minlength']) {
            <span class="text-sm text-red-700">Minimum 10 caractères.</span>
          }
        </div>

        <button type="submit" class="btn-primary w-full sm:w-auto" [disabled]="form.invalid">
          Envoyer
        </button>
      </form>
    </section>
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
