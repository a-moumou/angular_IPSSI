import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardApiService } from '../../services/card-api.service';
import { FilterService } from '../../services/filter.service';
import { CollectionService } from '../../services/collection.service';
import { Card } from '../../models';

const PER_PAGE = 24;

@Component({
  selector: 'app-card-list',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './card-list.component.html',
})
export class CardListComponent implements OnInit {
  private api = inject(CardApiService);
  protected filters = inject(FilterService);
  protected collection = inject(CollectionService);

  cards = signal<Card[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  recherche = '';

  page = signal(1);
  totalCards = signal(0);
  perPage = PER_PAGE;

  totalPages = computed(() => Math.max(1, Math.ceil(this.totalCards() / PER_PAGE)));
  lastCard   = computed(() => Math.min(this.page() * PER_PAGE, this.totalCards()));

  // Génère [1, '…', 4, 5, 6, '…', 20] selon la page courante
  pageNumbers = computed<(number | '…')[]>(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '…')[] = [1];
    if (current > 4) pages.push('…');

    const start = Math.max(2, current - 2);
    const end   = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push('…');
    pages.push(total);
    return pages;
  });

  ngOnInit() { this.charger(); }

  charger() {
    this.loading.set(true);
    this.error.set(null);
    const offset = (this.page() - 1) * PER_PAGE;
    this.api.getCards(this.filters.filters(), PER_PAGE, offset).subscribe({
      next: res => {
        this.cards.set(res.data);
        this.totalCards.set(res.meta?.total_rows ?? res.data.length);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur de chargement des cartes.');
        this.loading.set(false);
      },
    });
  }

  goToPage(n: number) {
    if (n < 1 || n > this.totalPages() || n === this.page()) return;
    this.page.set(n);
    this.charger();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  rechercher() {
    this.filters.setRecherche(this.recherche);
    this.page.set(1);
    this.charger();
  }

  filtrerType(type: string) {
    this.filters.setType(type);
    this.page.set(1);
    this.charger();
  }

  filtrerAttribut(attr: string) {
    this.filters.setAttribute(attr);
    this.page.set(1);
    this.charger();
  }

  reinitialiser() {
    this.filters.reset();
    this.recherche = '';
    this.page.set(1);
    this.charger();
  }
}
