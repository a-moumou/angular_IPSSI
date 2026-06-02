import { Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardApiService } from '../../services/card-api.service';
import { CollectionService } from '../../services/collection.service';
import { Card } from '../../models';

@Component({
  selector: 'app-card-detail',
  imports: [RouterLink],
  templateUrl: './card-detail.component.html',
})
export class CardDetailComponent implements OnInit {
  private api = inject(CardApiService);
  protected collection = inject(CollectionService);

  id = input.required<string>();

  card = signal<Card | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit() {
    this.api.getCardById(Number(this.id())).subscribe({
      next: c => { this.card.set(c); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
