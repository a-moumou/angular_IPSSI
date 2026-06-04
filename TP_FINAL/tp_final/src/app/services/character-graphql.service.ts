/**
 * Service GraphQL pour la liste des personnages (variante bonus du TP).
 * Adapte la réponse GraphQL au format ApiResponse<Character> utilisé par les pages.
 */

import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Character } from '../models/character.model';
import {
  GET_CHARACTERS,
  GraphqlCharactersResponse,
  GraphqlCharacterResult,
} from '../graphql/characters.query';

const API_BASE = 'https://rickandmortyapi.com/api';

function locationUrl(id: string | null): string {
  return id ? `${API_BASE}/location/${id}` : '';
}

@Injectable({ providedIn: 'root' })
export class CharacterGraphqlService {
  private readonly apollo = inject(Apollo);

  getAll(
    page: number,
    name?: string,
    status?: string,
  ): Observable<ApiResponse<Character>> {
    return this.apollo
      .query<GraphqlCharactersResponse>({
        query: GET_CHARACTERS,
        variables: {
          page,
          name: name?.trim() || undefined,
          status: status || undefined,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('Réponse GraphQL vide');
          }
          return this.toApiResponse(result.data.characters);
        }),
      );
  }

  private toApiResponse(
    data: GraphqlCharactersResponse['characters'],
  ): ApiResponse<Character> {
    return {
      info: {
        count: data.info.count,
        pages: data.info.pages,
        next: data.info.next !== null ? String(data.info.next) : null,
        prev: data.info.prev !== null ? String(data.info.prev) : null,
      },
      results: (data.results ?? []).map((c) => this.toCharacter(c)),
    };
  }

  private toCharacter(g: GraphqlCharacterResult): Character {
    return {
      id: Number(g.id),
      name: g.name,
      status: g.status,
      species: g.species,
      type: g.type ?? '',
      gender: g.gender,
      image: g.image,
      url: `${API_BASE}/character/${g.id}`,
      origin: {
        name: g.origin.name,
        url: locationUrl(g.origin.id),
      },
      location: {
        name: g.location.name,
        url: locationUrl(g.location.id),
      },
      episode: g.episode.map((ep) => `${API_BASE}/episode/${ep.id}`),
    };
  }
}
