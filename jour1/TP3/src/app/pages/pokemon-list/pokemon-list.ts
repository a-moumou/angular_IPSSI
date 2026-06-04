/**
 * Page liste des Pokémon (génération 1 par défaut).
 * Filtre local par nom et liens vers les fiches détail.
 */
import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonApiService } from '../../services/pokemon-api';

@Component({
  selector: 'app-pokemon-list',
  imports: [RouterLink],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
})
export class PokemonListComponent {
  private api = inject(PokemonApiService);

  pokemons = toSignal(this.api.getList(), { initialValue: [] }); // Liste chargée depuis l'API
  recherche = signal(''); // Texte du champ de recherche

  // Pokémon dont le nom contient la chaîne recherchée (insensible à la casse)
  filtres = computed(() => {
    const q = this.recherche().toLowerCase().trim();
    return this.pokemons().filter(p => p.name.includes(q));
  });

  onSearch(event: Event) {
    this.recherche.set((event.target as HTMLInputElement).value);
  }
}
