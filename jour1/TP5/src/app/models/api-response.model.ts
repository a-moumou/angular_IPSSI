/**
 * Enveloppe générique des réponses paginées de l'API YGOPRODeck.
 */
import { Card } from './card.model';

export interface ApiResponse<T> {
  data: T[];
  meta?: {
    total_rows: number;
    pages_remaining: number;
  };
}

export type CardResponse = ApiResponse<Card>;
