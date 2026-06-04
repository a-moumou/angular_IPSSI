/**
 * Shell de l'application Pokédex : navigation et zone de routage.
 * Injecte le service favoris pour afficher le compteur dans la barre.
 */
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FavorisService } from './services/favoris';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  favoris = inject(FavorisService); // Compteur et état des favoris dans le header
}
