/**
 * Affichage d'une ligne de tâche (titre, date, actions).
 * Remonte les événements toggle et delete au composant parent.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  imports: [DatePipe],
  templateUrl: './task-item.html',
})
export class TaskItem {
  @Input({ required: true }) task!: Task;           // Tâche à afficher
  @Output() toggle = new EventEmitter<number>();    // Clic case à cocher → id
  @Output() delete = new EventEmitter<number>();    // Clic suppression → id
}
