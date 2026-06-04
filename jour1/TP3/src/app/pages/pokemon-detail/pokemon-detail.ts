/**
 * Fiche détail d'un Pokémon (route /pokemon/:name).
 * Charge les données via l'API et permet d'ajouter/retirer des favoris.
 */
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { PokemonApiService } from '../../services/pokemon-api';
import { FavorisService } from '../../services/favoris';

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css',
})
export class PokemonDetailComponent {
  private api = inject(PokemonApiService);
  favoris = inject(FavorisService);

  name = input.required<string>(); // Lié au paramètre :name grâce à withComponentInputBinding

  // Recharge le Pokémon à chaque changement de nom dans l'URL
  pokemon = toSignal(
    toObservable(this.name).pipe(
      switchMap(n => this.api.getByName(n))
    )
  );
}
