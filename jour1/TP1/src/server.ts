/**
 * Serveur Express pour le SSR Angular (TP1).
 * Sert les fichiers statiques du build navigateur et délègue le reste à Angular.
 */
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

// Dossier contenant le build navigateur (fichiers statiques)
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

// Fichiers statiques (JS, CSS, images) depuis le dossier browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Toutes les autres requêtes : rendu de l'application Angular
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Démarre le serveur si ce fichier est le point d'entrée (ou via PM2)
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Handler exporté pour le CLI Angular ou Firebase Cloud Functions
export const reqHandler = createNodeRequestHandler(app);
