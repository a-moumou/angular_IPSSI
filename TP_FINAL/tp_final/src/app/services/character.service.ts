/**
 * Service HTTP pour les personnages (API REST Rick & Morty).
 * Liste paginée, détail, chargement groupé par ids et compteur total.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
// Observable : flux asynchrone ; map : transforme la réponse ; of : valeur immédiate
import { Observable, map, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Character } from '../models/character.model';

const API_URL = 'https://rickandmortyapi.com/api/character';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly http = inject(HttpClient);

  getAll(
    page: number,
    name?: string,
    status?: string,
  ): Observable<ApiResponse<Character>> {
    let params = new HttpParams().set('page', page);
    if (name?.trim()) {
      params = params.set('name', name.trim());
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<Character>>(API_URL, { params });
  }

  getById(id: number): Observable<Character> {
    return this.http.get<Character>(`${API_URL}/${id}`);
  }

  getMany(ids: number[]): Observable<Character[]> {
    if (ids.length === 0) {
      return of([]);
    }
    const idList = ids.join(',');
    return this.http.get<Character[] | Character>(`${API_URL}/${idList}`).pipe(
      // L'API renvoie un objet seul ou un tableau selon le nombre d'ids
      map((data) => (Array.isArray(data) ? data : [data])),
    );
  }

  getCount(): Observable<number> {
    return this.getAll(1).pipe(map((res) => res.info.count));
  }
}
