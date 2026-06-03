export interface CharacterOrigin {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: CharacterOrigin;
  location: CharacterOrigin;
  episode: string[];
  url: string;
}
