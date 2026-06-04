/**
 * Formulaire d'ajout d'une nouvelle tâche.
 * Émet l'événement « add » vers le parent avec le titre saisi.
 */
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.html',
})
export class TaskForm {
  newTitle = ''; // Champ de saisie lié au template
  @Output() add = new EventEmitter<string>(); // Émis au parent lors de la soumission

  // Valide, émet le titre puis réinitialise le champ
  onSubmit() {
    if (!this.newTitle.trim()) return;
    this.add.emit(this.newTitle.trim());
    this.newTitle = '';
  }
}
