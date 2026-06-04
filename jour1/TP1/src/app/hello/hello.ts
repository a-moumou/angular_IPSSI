/**
 * Page d'accueil du TP1 regroupant les démos.
 * Affiche les citations inspirantes et la carte météo.
 */
import { Component } from '@angular/core';
import { Citation } from '../citation/citation';
import { MeteoCarte } from '../meteo-carte/meteo-carte';

@Component({
  selector: 'app-hello',
  imports: [Citation, MeteoCarte],
  templateUrl: './hello.html',
  styleUrl: './hello.css',
})
export class Hello {
  // Affiche une alerte de confirmation au clic sur le bouton contact
  onContact() {
    alert('Merci de me contacter ! Je vous répondrai bientôt.');
  }
}
