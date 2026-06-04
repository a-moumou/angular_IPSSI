/**
 * Composant racine : navigation et compteur de favoris dans l'en-tête.
 */
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FavorisService } from './services/favoris.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private favoris = inject(FavorisService);
  protected favorisCount = this.favoris.nombre; // Signal dérivé affiché dans le template
}
