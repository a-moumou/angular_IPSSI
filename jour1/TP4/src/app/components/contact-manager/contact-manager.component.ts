/**
 * Composant principal : liste, ajout, édition et suppression de contacts.
 */
import { Component, inject, signal, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact, NouveauContact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-manager',
  imports: [],
  templateUrl: './contact-manager.component.html',
  styleUrl: './contact-manager.component.scss',
})
export class ContactManagerComponent implements OnInit {
  private service = inject(ContactService);

  contacts = signal<Contact[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  enEdition = signal<Contact | null>(null); // Contact en cours de modification

  ngOnInit() {
    this.charger();
  }

  /** Charge les contacts depuis l'API */
  charger() {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: data => { this.contacts.set(data); this.loading.set(false); },
      error: () => {
        this.error.set('Impossible de charger (json-server est-il lancé sur :3000 ?)');
        this.loading.set(false);
      },
    });
  }

  /** Enregistre un nouveau contact ou met à jour celui en édition */
  enregistrer(form: { nom: string; email: string; tel: string }) {
    const enEdition = this.enEdition();

    if (enEdition) {
      const maj: Contact = { ...enEdition, ...form };
      this.service.update(maj).subscribe({
        next: c => {
          this.contacts.update(list => list.map(x => x.id === c.id ? c : x));
          this.annulerEdition();
        },
        error: () => this.error.set('Échec de la modification'),
      });
    } else {
      this.service.create(form as NouveauContact).subscribe({
        next: c => this.contacts.update(list => [...list, c]),
        error: () => this.error.set("Échec de l'ajout"),
      });
    }
  }

  /** Passe le formulaire en mode édition pour ce contact */
  editer(contact: Contact) {
    this.enEdition.set(contact);
  }

  /** Quitte le mode édition */
  annulerEdition() {
    this.enEdition.set(null);
  }

  /** Supprime un contact après confirmation */
  supprimer(contact: Contact) {
    if (!confirm(`Supprimer ${contact.nom} ?`)) return;

    this.service.delete(contact.id).subscribe({
      next: () => this.contacts.update(list => list.filter(c => c.id !== contact.id)),
      error: () => this.error.set('Échec de la suppression'),
    });
  }
}
