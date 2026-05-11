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
  onContact() {
    alert('Merci de me contacter ! Je vous répondrai bientôt.');
  }
}
