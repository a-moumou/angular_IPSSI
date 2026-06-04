/**
 * Carte météo interactive : recherche par ville et affichage des conditions.
 * Utilise Open-Meteo via MeteoService et des icônes Lucide selon le temps.
 */
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle, CloudSun, Thermometer, Droplets, Wind, Search } from 'lucide-angular';
import { MeteoService } from './meteo.service';

// Association libellé météo → composant icône Lucide
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

  // Icônes exposées au template
  readonly Search = Search;
  readonly Droplets = Droplets;
  readonly Wind = Wind;

  meteo = signal<any>(null);       // Données météo courantes
  chargement = signal(true);       // Indicateur de chargement
  erreur = signal(false);          // Erreur API ou ville introuvable
  ville = 'Paris';                 // Ville saisie par l'utilisateur

  constructor() { this.rechercher(); }

  // Lance une requête météo pour la ville saisie
  rechercher() {
    if (!this.ville.trim()) return;
    this.chargement.set(true);
    this.erreur.set(false);

    this.service.chercher(this.ville).subscribe({
      next: (data) => { this.meteo.set(data); this.chargement.set(false); },
      error: () => { this.erreur.set(true); this.chargement.set(false); },
    });
  }

  // Icône correspondant à la condition actuelle (thermomètre par défaut)
  get icon() { return ICONS[this.meteo()?.condition] ?? Thermometer; }
}
