/**
 * Composant racine du TP2 — application TodoList.
 * Affiche uniquement la liste des tâches via app-task-list.
 */
import { Component } from '@angular/core';
import { TaskList } from './components/task-list/task-list';

@Component({
  selector: 'app-root',
  imports: [TaskList],
  template: `<app-task-list />`,
})
export class App {}
