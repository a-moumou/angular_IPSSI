/**
 * Enveloppe générique des réponses paginées de l'API REST.
 * Permet de typer getAll() pour personnages, lieux ou épisodes.
 */

import { Info } from './info.model';

export interface ApiResponse<T> {
  info: Info;
  results: T[];
}
