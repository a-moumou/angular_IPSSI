import { Injectable, computed, inject, signal } from '@angular/core';
import { Character } from '../models/character.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'rick-morty-favoris';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private readonly storage = inject(StorageService);

  readonly favoris = signal<Character[]>(this.loadFromStorage());

  readonly nombre = computed(() => this.favoris().length);

  readonly repartitionParStatut = computed(() => {
    const counts = { Alive: 0, Dead: 0, unknown: 0 };
    for (const c of this.favoris()) {
      if (c.status === 'Alive') {
        counts.Alive++;
      } else if (c.status === 'Dead') {
        counts.Dead++;
      } else {
        counts.unknown++;
      }
    }
    return counts;
  });

  toggle(character: Character): void {
    if (this.isFavori(character.id)) {
      this.favoris.update((list) => list.filter((c) => c.id !== character.id));
    } else {
      this.favoris.update((list) => [...list, character]);
    }
    this.persist();
  }

  isFavori(id: number): boolean {
    return this.favoris().some((c) => c.id === id);
  }

  private loadFromStorage(): Character[] {
    return this.storage.get<Character[]>(STORAGE_KEY) ?? [];
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this.favoris());
  }
}
