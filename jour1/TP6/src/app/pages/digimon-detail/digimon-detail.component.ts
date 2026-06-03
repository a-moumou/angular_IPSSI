import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DigimonGraphqlService } from '../../services/digimon-graphql.service';
import { Digimon } from '../../models/digimon.model';

@Component({
  selector: 'app-digimon-detail',
  imports: [RouterLink],
  templateUrl: './digimon-detail.component.html',
  styleUrl: './digimon-detail.component.css',
})
export class DigimonDetailComponent {
  private service = inject(DigimonGraphqlService);

  id = input.required<string>();

  digimon = signal<Digimon | null>(null);
  loading = signal(true);

  constructor() {
    afterNextRender(() => {
      this.service.getDigimon(Number(this.id())).subscribe({
        next: d => { this.digimon.set(d); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    });
  }
}
