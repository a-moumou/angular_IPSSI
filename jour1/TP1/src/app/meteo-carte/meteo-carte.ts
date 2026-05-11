import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle, CloudSun, Thermometer, Droplets, Wind, Search } from 'lucide-angular';
import { MeteoService } from './meteo.service';

const ICONS: Record<string, any> = {
  'Ensoleillé':  Sun,
  'Peu nuageux': CloudSun,
  'Nuageux':     Cloud,
  'Brumeux':     CloudFog,
  'Pluvieux':    CloudRain,
  'Neigeux':     CloudSnow,
  'Averses':     CloudDrizzle,
  'Orageux':     CloudLightning,
};

@Component({
  selector: 'app-meteo-carte',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './meteo-carte.html',
})
export class MeteoCarte {
  private service = inject(MeteoService);

  readonly Search = Search;
  readonly Droplets = Droplets;
  readonly Wind = Wind;

  meteo = signal<any>(null);
  chargement = signal(true);
  erreur = signal(false);
  ville = 'Paris';

  constructor() { this.rechercher(); }

  rechercher() {
    if (!this.ville.trim()) return;
    this.chargement.set(true);
    this.erreur.set(false);

    this.service.chercher(this.ville).subscribe({
      next: (data) => { this.meteo.set(data); this.chargement.set(false); },
      error: () => { this.erreur.set(true); this.chargement.set(false); },
    });
  }

  get icon() { return ICONS[this.meteo()?.condition] ?? Thermometer; }
}
