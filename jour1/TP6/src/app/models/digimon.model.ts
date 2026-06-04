/**
 * Types TypeScript alignés sur le schéma GraphQL du Digidex.
 */

export interface Image {
  href: string;
  transparent: boolean;
}

export interface Evolution {
  id: number;
  digimon: string;
  condition: string;
  image: string;
}

// Fiche complète d'un Digimon
export interface Digimon {
  id: number;
  name: string;
  releaseDate?: string;
  images?: Image[];
  levels?: string[];
  types?: string[];
  attributes?: string[];
  descriptions?: string[];
  priorEvolutions?: Evolution[];
  nextEvolutions?: Evolution[];
}

// Résumé pour la liste et les favoris
export interface DigimonSummary {
  id: number;
  name: string;
  image: string;
}

// Page paginée renvoyée par la query digimons
export interface DigimonPage {
  items: DigimonSummary[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
