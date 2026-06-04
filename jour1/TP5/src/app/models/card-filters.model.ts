/**
 * Filtres optionnels passés à l'API cardinfo.php.
 */
export interface CardFilters {
  fname?: string;      // Recherche par nom (partiel)
  type?: string;       // Type de carte (monstre, magie…)
  attribute?: string;  // Attribut des monstres
  archetype?: string;  // Archétype
}
