/**
 * Pipe « truncate » : raccourcit un texte long avec une ellipse (…).
 * Paramètre optionnel limit (défaut 50 caractères).
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    if (!value || value.length <= limit) {
      return value;
    }
    return `${value.slice(0, limit)}…`;
  }
}
