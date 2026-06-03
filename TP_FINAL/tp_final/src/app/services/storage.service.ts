import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  get<T>(key: string): T | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
}
