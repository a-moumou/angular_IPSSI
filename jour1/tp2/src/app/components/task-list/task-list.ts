/**
 * Liste principale des tâches avec filtres et formulaire d'ajout.
 * Combine le service TaskService et un filtre (toutes / actives / terminées).
 */
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskItem } from '../task-item/task-item';
import { TaskForm } from '../task-form/task-form';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe, TaskItem, TaskForm],
  templateUrl: './task-list.html',
})
export class TaskList {
  private taskService = inject(TaskService);

  private filterSubject = new BehaviorSubject<Filter>('all');
  filter$ = this.filterSubject.asObservable();

  // Liste filtrée : recalculée à chaque changement de tâches ou de filtre
  filteredTasks$: Observable<Task[]> = combineLatest([
    this.taskService.getTasks(),
    this.filter$,
  ]).pipe(
    map(([tasks, filter]) => {
      if (filter === 'active') return tasks.filter(t => !t.done);
      if (filter === 'done')   return tasks.filter(t => t.done);
      return tasks;
    })
  );

  // Boutons de filtre affichés dans le template
  filters: { label: string; value: Filter }[] = [
    { label: 'Toutes',    value: 'all' },
    { label: 'Actives',   value: 'active' },
    { label: 'Terminées', value: 'done' },
  ];

  setFilter(f: Filter) { this.filterSubject.next(f); }
  onAdd(title: string)  { this.taskService.addTask(title); }
  onToggle(id: number)  { this.taskService.toggleTask(id); }
  onDelete(id: number)  { this.taskService.deleteTask(id); }
}
