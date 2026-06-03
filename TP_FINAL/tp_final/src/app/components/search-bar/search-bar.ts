import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="search-bar">
      <label for="search-input">Rechercher par nom</label>
      <input
        id="search-input"
        type="search"
        placeholder="Ex : Rick, Morty…"
        [(ngModel)]="term"
        (ngModelChange)="onSearch($event)"
      />
    </div>
  `,
  styles: `
    .search-bar {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      flex: 1;
      min-width: 200px;
    }
    label {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    input {
      padding: 0.6rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      font-size: 1rem;
    }
    input:focus {
      outline: 2px solid var(--accent);
      outline-offset: 1px;
    }
  `,
})
export class SearchBarComponent {
  readonly searchChange = output<string>();
  term = '';

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}
