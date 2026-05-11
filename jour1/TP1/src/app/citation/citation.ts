import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-citation',
  imports: [],
  templateUrl: './citation.html',
  styleUrl: './citation.css',
})
export class Citation {
  private citations = [
    { texte: 'Le seul moyen de faire du bon travail est d\'aimer ce que vous faites.', auteur: 'Steve Jobs' },
    { texte: 'La vie, c\'est comme une bicyclette, il faut avancer pour ne pas perdre l\'équilibre.', auteur: 'Albert Einstein' },
    { texte: 'Le succès, c\'est tomber sept fois et se relever huit.', auteur: 'Proverbe japonais' },
    { texte: 'Soyez le changement que vous voulez voir dans le monde.', auteur: 'Gandhi' },
    { texte: 'La créativité, c\'est l\'intelligence qui s\'amuse.', auteur: 'Albert Einstein' },
  ];

  private index = signal(0);

  get citation() {
    return this.citations[this.index()];
  }

  changer() {
    this.index.set((this.index() + 1) % this.citations.length);
  }
}
