/**
 * Modèle d'un lieu (planète, dimension, etc.) depuis /api/location.
 * residents contient des URLs vers les personnages résidents.
 */

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
}
