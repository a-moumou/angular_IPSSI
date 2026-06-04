/**
 * Page deck : affiche la collection et des totaux par type (monstres, magies, pièges).
 */
import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CollectionService } from '../../services/collection.service';

@Component({
  selector: 'app-deck',
  imports: [RouterLink],
  templateUrl: './deck.component.html',
})
export class DeckComponent {
  protected collection = inject(CollectionService);

  monstres = computed(() =>
    this.collection.deck()
      .filter(e => e.card.type.includes('Monster'))
      .reduce((acc, e) => acc + e.quantite, 0)
  );

  magies = computed(() =>
    this.collection.deck()
      .filter(e => e.card.type.includes('Spell'))
      .reduce((acc, e) => acc + e.quantite, 0)
  );

  pieges = computed(() =>
    this.collection.deck()
      .filter(e => e.card.type.includes('Trap'))
      .reduce((acc, e) => acc + e.quantite, 0)
  );
}
