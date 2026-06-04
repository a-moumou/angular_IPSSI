/**
 * Page listant les Pokémon marqués en favoris.
 * S'appuie sur FavorisService partagé avec le reste de l'application.
 */
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris';

@Component({
  selector: 'app-favoris',
  imports: [RouterLink],
  templateUrl: './favoris.html',
  styleUrl: './favoris.css',
})
export class FavorisComponent {
  favoris = inject(FavorisService);
}
