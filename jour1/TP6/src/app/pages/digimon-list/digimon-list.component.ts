/**
 * Liste paginée des Digimon avec recherche par nom et favoris.
 */
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DigimonGraphqlService } from '../../services/digimon-graphql.service';
import { FavorisService } from '../../services/favoris.service';
import { DigimonPage } from '../../models/digimon.model';

@Component({
  selector: 'app-digimon-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './digimon-list.component.html',
  styleUrl: './digimon-list.component.css',
})
export class DigimonListComponent {
  private service = inject(DigimonGraphqlService);
  protected favoris = inject(FavorisService);

  page = signal<DigimonPage | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  recherche = signal('');
  pageCourante = signal(0); // Index de page côté API (0-based)

  constructor() {
    // Charge les données uniquement côté navigateur (évite le SSR sans API)
    afterNextRender(() => this.charger());
  }

  charger() {
    this.loading.set(true);
    this.error.set(null);
    const nom = this.recherche().trim() || undefined;
    this.service.getDigimons(this.pageCourante(), 20, nom).subscribe({
      next: data => { this.page.set(data); this.loading.set(false); },
      error: () => { this.error.set('Le serveur GraphQL (:4000) est-il lancé ?'); this.loading.set(false); },
    });
  }

  rechercher() {
    this.pageCourante.set(0);
    this.charger();
  }

  pagePrecedente() { if (this.pageCourante() > 0) { this.pageCourante.update(p => p - 1); this.charger(); } }
  pageSuivante()   { this.pageCourante.update(p => p + 1); this.charger(); }
}
