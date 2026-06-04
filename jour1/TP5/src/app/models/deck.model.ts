/**
 * Une entrée du deck local : carte + quantité (max 3 en jeu).
 */
import { Card } from './card.model';

export interface DeckEntry {
  card: Card;
  quantite: number;
}
