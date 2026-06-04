/**
 * Types TypeScript pour les réponses de l'API PokéAPI.
 * Couvre la liste paginée, l'aperçu carte et le détail complet d'un Pokémon.
 */

// Réponse brute de GET /pokemon?limit=…
export interface PokemonListResponse {
  count: number;
  results: { name: string; url: string }[];
}

// Données simplifiées pour la grille de la liste
export interface PokemonPreview {
  name: string;
  id: number;
  image: string;
}

// Structure complète renvoyée par GET /pokemon/:name
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other: {
      'official-artwork': { front_default: string };
    };
  };
}
