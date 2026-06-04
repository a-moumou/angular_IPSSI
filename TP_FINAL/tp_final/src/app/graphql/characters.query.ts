import { gql } from 'apollo-angular';

export interface GraphqlLocationRef {
  id: string | null;
  name: string;
}

export interface GraphqlCharacterResult {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: GraphqlLocationRef;
  location: GraphqlLocationRef;
  episode: { id: string; name: string }[];
}

export interface GraphqlCharactersResponse {
  characters: {
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: GraphqlCharacterResult[] | null;
  };
}

export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $name: String, $status: String) {
    characters(page: $page, filter: { name: $name, status: $status }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        image
        origin {
          id
          name
        }
        location {
          id
          name
        }
        episode {
          id
          name
        }
      }
    }
  }
`;
