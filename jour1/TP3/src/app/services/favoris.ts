/**
 * Gestion des Pokémon favoris en mémoire (signals Angular).
 * Partagé dans toute l'app pour la liste, le détail et le compteur du header.
 */
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private _favoris = signal<string[]>([]); // Noms des Pokémon favoris

  favoris = this._favoris.asReadonly();              // Signal en lecture seule pour les templates
  nombre = computed(() => this._favoris().length);   // Compteur affiché dans la navigation

  estFavori(name: string): boolean {
    return this._favoris().includes(name);
  }

  // Ajoute ou retire un Pokémon de la liste des favoris
  basculer(name: string) {
    this._favoris.update(list =>
      list.includes(name) ? list.filter(n => n !== name) : [...list, name]
    );
  }
}
