/**
 * Routes de l'application : catalogue, fiche carte et deck personnel.
 */
import { Routes } from '@angular/router';
import { CardListComponent } from './pages/card-list/card-list.component';
import { CardDetailComponent } from './pages/card-detail/card-detail.component';
import { DeckComponent } from './pages/deck/deck.component';

export const routes: Routes = [
  { path: '', component: CardListComponent },
  { path: 'carte/:id', component: CardDetailComponent },
  { path: 'deck', component: DeckComponent },
  { path: '**', redirectTo: '' }, // Route inconnue → accueil
];
