/**
 * Utilitaire pour extraire l'identifiant numérique depuis une URL API Rick & Morty.
 * Exemple : https://rickandmortyapi.com/api/episode/12 → 12
 */

export function extractIdFromUrl(url: string): number | null {
  if (!url) {
    return null;
  }
  const segment = url.split('/').pop();
  if (!segment) {
    return null;
  }
  const id = Number(segment);
  return Number.isNaN(id) ? null : id;
}
