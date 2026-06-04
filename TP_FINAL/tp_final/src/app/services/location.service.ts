/**
 * Service HTTP pour les lieux (API REST /api/location).
 * Fournit la liste paginée, le détail d'un lieu et le nombre total.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Location } from '../models/location.model';

const API_URL = 'https://rickandmortyapi.com/api/location';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);

  getAll(page: number): Observable<ApiResponse<Location>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Location>>(API_URL, { params });
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${API_URL}/${id}`);
  }

  getCount(): Observable<number> {
    return this.getAll(1).pipe(map((res) => res.info.count));
  }
}
