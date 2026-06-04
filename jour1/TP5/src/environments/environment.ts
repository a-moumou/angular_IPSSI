/**
 * Variables d'environnement de l'application (mode dev par défaut).
 * L'URL de base pointe vers l'API publique YGOPRODeck.
 */
export const environment = {
  production: false, // false = développement local
  apiBaseUrl: 'https://db.ygoprodeck.com/api/v7', // Racine des endpoints cartes
};
