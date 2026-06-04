/**
 * Modèle d'un épisode de la série (endpoint REST /api/episode).
 * Les personnages associés sont des URLs à résoudre via extractIdFromUrl.
 */

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
}
