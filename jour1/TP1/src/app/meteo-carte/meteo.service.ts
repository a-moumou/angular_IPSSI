/**
 * Service météo : géocodage d'une ville puis récupération des données Open-Meteo.
 * Transforme les codes météo API en libellés français lisibles.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MeteoService {
  private http = inject(HttpClient);

  // Recherche une ville, puis charge la météo actuelle à ses coordonnées
  chercher(nom: string) {
    return this.http
      .get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nom)}&count=1&language=fr`)
      .pipe(
        switchMap((geo) => {
          const { name, latitude, longitude } = geo.results[0];
          return this.http
            .get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`)
            .pipe(
              map((res) => ({
                ville: name,
                temperature: Math.round(res.current.temperature_2m),
                condition: this.codeVersCondition(res.current.weather_code),
                humidite: res.current.relative_humidity_2m,
                vent: Math.round(res.current.wind_speed_10m),
              }))
            );
        })
      );
  }

  // Convertit le code WMO de l'API en libellé français pour l'affichage
  private codeVersCondition(code: number) {
    if (code === 0) return 'Ensoleillé';
    if (code <= 2)  return 'Peu nuageux';
    if (code <= 3)  return 'Nuageux';
    if (code <= 48) return 'Brumeux';
    if (code <= 67) return 'Pluvieux';
    if (code <= 77) return 'Neigeux';
    if (code <= 82) return 'Averses';
    return 'Orageux';
  }
}
