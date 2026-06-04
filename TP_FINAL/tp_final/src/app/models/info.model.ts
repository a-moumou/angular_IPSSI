/**
 * Métadonnées de pagination renvoyées par l'API REST Rick & Morty.
 * Utilisées dans ApiResponse pour naviguer entre les pages de résultats.
 */

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}
