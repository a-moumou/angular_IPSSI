/**
 * Client HTTP vers PokéAPI (pokeapi.co).
 * Fournit la liste des premiers Pokémon et le détail par nom.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  PokemonListResponse,
  PokemonPreview,
  PokemonDetail,
} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://pokeapi.co/api/v2';

  // Récupère les N premiers Pokémon avec id et URL d'image officielle
  getList(limit = 151): Observable<PokemonPreview[]> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`)
      .pipe(
        map(res =>
          res.results.map(p => {
            // L'id est extrait du dernier segment de l'URL PokéAPI
            const id = Number(p.url.split('/').filter(Boolean).pop());
            return {
              name: p.name,
              id,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            };
          })
        )
      );
  }

  // Détail complet d'un Pokémon par son nom (slug API)
  getByName(name: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${name}`);
  }
}
