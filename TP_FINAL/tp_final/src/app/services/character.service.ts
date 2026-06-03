import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
      map((data) => (Array.isArray(data) ? data : [data])),
    );
  }

  getCount(): Observable<number> {
    return this.getAll(1).pipe(map((res) => res.info.count));
  }
}
