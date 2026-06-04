/**
 * Champ de recherche par nom avec liaison ngModel.
 * Émet searchChange à chaque frappe pour que le parent déclenche la requête.
 */

import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="flex min-w-[200px] flex-1 flex-col gap-2">
      <label for="search-input" class="label-field">Rechercher par nom</label>
      <div class="relative">
        <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500"
          >🔍</span
        >
        <input
          id="search-input"
          type="search"
          placeholder="Ex : Rick, Morty…"
          class="input-field pl-10"
          [(ngModel)]="term"
          (ngModelChange)="onSearch($event)"
        />
      </div>
    </div>
  `,
})
export class SearchBarComponent {
  readonly searchChange = output<string>();
  term = '';

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}
