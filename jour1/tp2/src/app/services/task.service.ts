import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = this.load();

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(title: string): void {
    if (!title.trim()) return;
    this.tasks = [...this.tasks, { id: Date.now(), title: title.trim(), done: false, createdAt: new Date() }];
    this.save();
  }

  toggleTask(id: number): void {
    this.tasks = this.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    this.save();
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  private load(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [
      { id: 1, title: 'Apprendre Angular', done: false, createdAt: new Date() },
      { id: 2, title: 'Construire la TodoList', done: false, createdAt: new Date() },
    ];
    return JSON.parse(raw).map((t: Task) => ({ ...t, createdAt: new Date(t.createdAt) }));
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    this.tasksSubject.next(this.tasks);
  }
}
