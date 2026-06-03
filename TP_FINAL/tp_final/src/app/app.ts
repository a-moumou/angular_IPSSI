import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FavorisService } from './services/favoris.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly favorisService = inject(FavorisService);

  readonly nombreFavoris = this.favorisService.nombre;
  readonly badgeFavoris = computed(() =>
    this.nombreFavoris() > 0 ? String(this.nombreFavoris()) : '',
  );
}
