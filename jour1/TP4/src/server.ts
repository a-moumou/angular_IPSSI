/**
 * Serveur Express pour le SSR Angular (fichiers statiques + rendu de l'app).
 */
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

// Dossier contenant le build navigateur
const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Ici on pourrait définir des routes REST Express si besoin

// Sert les fichiers statiques du dossier browser (JS, CSS, images…)
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Toutes les autres requêtes sont rendues par Angular
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
