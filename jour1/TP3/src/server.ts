/**
 * Serveur Express pour le SSR du Pokédex (TP3).
 * Sert les assets statiques et délègue le rendu Angular aux autres requêtes.
 */
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Exemple d'endpoints REST Express — à décommenter si besoin d'une API.
 *
 * Exemple :
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Traiter la requête API
 * });
 * ```
 */

// Fichiers statiques du build navigateur
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Rendu Angular pour les routes non statiques
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Écoute sur PORT (défaut 4000) si module principal ou lancé via PM2
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
