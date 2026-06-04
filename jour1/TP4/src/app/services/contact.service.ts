/**
 * Service HTTP pour le CRUD des contacts via json-server.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, NouveauContact } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/contacts'; // URL de l'API mock

  /** Récupère la liste complète des contacts */
  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url);
  }

  /** Crée un nouveau contact */
  create(contact: NouveauContact): Observable<Contact> {
    return this.http.post<Contact>(this.url, contact);
  }

  /** Met à jour un contact existant (identifiant dans l'URL) */
  update(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.url}/${contact.id}`, contact);
  }

  /** Supprime un contact par son id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
