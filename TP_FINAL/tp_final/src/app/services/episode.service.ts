/**
 * Service HTTP pour les épisodes (API REST /api/episode).
 * Même pattern que CharacterService : pagination, détail et chargement multiple.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Episode } from '../models/episode.model';

const API_URL = 'https://rickandmortyapi.com/api/episode';

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private readonly http = inject(HttpClient);

  getAll(page: number): Observable<ApiResponse<Episode>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Episode>>(API_URL, { params });
  }

  getById(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${API_URL}/${id}`);
  }

  getMany(ids: number[]): Observable<Episode[]> {
    if (ids.length === 0) {
      return of([]);
    }
    const idList = ids.join(',');
    return this.http.get<Episode[] | Episode>(`${API_URL}/${idList}`).pipe(
      map((data) => (Array.isArray(data) ? data : [data])),
    );
  }

  getCount(): Observable<number> {
    return this.getAll(1).pipe(map((res) => res.info.count));
  }
}
