/**
 * Composant racine de l'application TP4 — gestionnaire de contacts.
 */
import { Component } from '@angular/core';
import { ContactManagerComponent } from './components/contact-manager/contact-manager.component';

@Component({
  selector: 'app-root',
  imports: [ContactManagerComponent],
  // Affiche directement le gestionnaire de contacts
  template: `<app-contact-manager />`,
})
export class App {}
