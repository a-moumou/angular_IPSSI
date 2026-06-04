/**
 * Modèles TypeScript pour les personnages de l'API REST Rick & Morty.
 * Représentent la structure JSON renvoyée par /api/character.
 */

/** Origine ou lieu actuel : nom affiché + URL vers la ressource location */
export interface CharacterOrigin {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: CharacterOrigin;
  location: CharacterOrigin;
  episode: string[];
  url: string;
}
