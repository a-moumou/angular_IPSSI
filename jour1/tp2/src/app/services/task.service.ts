/**
 * Service de gestion des tâches avec persistance localStorage.
 * Expose un flux RxJS réactif pour mettre à jour l'interface.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = this.load();

  // Sujet observable : les composants s'abonnent pour recevoir les mises à jour
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  // Flux des tâches (lecture seule pour les abonnés)
  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  // Ajoute une tâche si le titre n'est pas vide
  addTask(title: string): void {
    if (!title.trim()) return;
    this.tasks = [...this.tasks, { id: Date.now(), title: title.trim(), done: false, createdAt: new Date() }];
    this.save();
  }

  // Inverse l'état « terminée » d'une tâche par son id
  toggleTask(id: number): void {
    this.tasks = this.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    this.save();
  }

  // Supprime une tâche de la liste
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  // Charge depuis localStorage ou renvoie des tâches d'exemple par défaut
  private load(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [
      { id: 1, title: 'Apprendre Angular', done: false, createdAt: new Date() },
      { id: 2, title: 'Construire la TodoList', done: false, createdAt: new Date() },
    ];
    // Reconvertit createdAt en objet Date après désérialisation JSON
    return JSON.parse(raw).map((t: Task) => ({ ...t, createdAt: new Date(t.createdAt) }));
  }

  // Persiste en localStorage et notifie les abonnés
  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    this.tasksSubject.next(this.tasks);
  }
}
