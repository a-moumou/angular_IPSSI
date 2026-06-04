/**
 * Modèles TypeScript pour les contacts et la création sans identifiant.
 */

// Structure d'un contact tel que renvoyé par json-server
export interface Contact {
  id: number;
  nom: string;
  email: string;
  tel: string;
}

// Données envoyées à la création (l'id est généré côté API)
export type NouveauContact = Omit<Contact, 'id'>;
