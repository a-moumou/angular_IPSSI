# Rick & Morty Explorer

SPA Angular explorant l'API [Rick and Morty](https://rickandmortyapi.com) : personnages, lieux, épisodes, favoris persistants, dashboard et formulaire de contact.

## Lancer le projet

```bash
npm install
npm start
```

Ouvrir [http://localhost:4200](http://localhost:4200).

```bash
npm run build   # compilation production
```

## Fonctionnalités

- [x] 5 modèles TypeScript (`models/`)
- [x] 5 services HTTP + favoris + localStorage (`services/`)
- [x] 10 pages avec routing, lazy loading (`favoris`, `contact`), page 404
- [x] Relations : origine/lieu/épisodes ↔ personnages ↔ lieux ↔ épisodes
- [x] Recherche RxJS (`debounceTime`, `distinctUntilChanged`, `switchMap`) + filtre status
- [x] Pagination sur les 3 listes
- [x] Favoris (signal + computed + persistance localStorage)
- [x] Dashboard (totaux API + répartition favoris par statut)
- [x] Formulaire réactif contact avec validateurs
- [x] 5 composants dumb + 2 pipes + `OnPush`
- [x] `withComponentInputBinding()` + `input.required()` sur les pages détail

## Architecture

```
src/app/
├── models/       info, api-response, character, location, episode
├── services/     character, location, episode, favoris, storage
├── components/   character-card, search-bar, paginator, loader, error-message
├── pipes/        status, truncate
├── pages/        dashboard, listes, détails, favoris, contact, not-found
├── utils/        extractIdFromUrl
├── app.routes.ts
└── app.config.ts
```

## Design patterns

| Pattern | Où | Pourquoi |
|---------|-----|----------|
| **Singleton** | `providedIn: 'root'` sur les services | Une seule instance partagée (ex. `CharacterService`) |
| **Smart / Dumb** | Pages vs `CharacterCardComponent` | La page orchestre les données ; la carte affiche et émet des événements |
| **Observer** | RxJS + `HttpClient` | Flux asynchrones API |
| **State local réactif** | `signal` / `computed` dans `FavorisService` | État favoris sans boilerplate RxJS |
| **Facade** | `StorageService` | Encapsule `localStorage` |
| **Lazy loading** | Routes `favoris`, `contact` | Réduit le bundle initial |

## Réponses aux questions

### 1. Composant smart vs dumb ?

Un composant **smart** charge des données, appelle des services et gère la logique (ex. `CharactersList`). Un composant **dumb** reçoit des `input()`, émet des `output()` et ne connaît pas l'API (ex. `CharacterCardComponent` qui affiche un personnage et émet `toggleFavori`).

### 2. Pourquoi `OnPush` ?

`OnPush` ne déclenche la détection de changements que si les `@Input` changent, un événement DOM survient, ou un **signal** est lu/mis à jour. Cela impose de passer des **références immuables** (nouveau tableau/objet) plutôt que de muter en place, ce qui rend le flux de données prévisible.

### 3. `async` pipe vs `subscribe()` ?

Le pipe `async` s'abonne et **se désabonne automatiquement** à la destruction du composant. Un `subscribe()` manuel oublié provoque des fuites mémoire et des mises à jour sur un composant détruit.

### 4. `providedIn: 'root'` ?

C'est le pattern **Singleton** : Angular crée **une seule instance** de `CharacterService` pour toute l'application.

### 5. `signal` vs `BehaviorSubject` ?

Les deux stockent une valeur réactive. Le `signal` est intégré au template Angular, plus simple pour l'état synchrone local (favoris). `BehaviorSubject` convient mieux aux flux RxJS multi-émetteurs ; ici les favoris sont une liste locale sans stream HTTP continu.

### 6. `switchMap` et `debounceTime` ?

`debounceTime(300)` attend 300 ms sans frappe avant de relancer la recherche. `switchMap` **annule** la requête HTTP précédente si une nouvelle recherche arrive — contrairement à `mergeMap` qui laisserait plusieurs requêtes se terminer dans le désordre.

### 7. Reactive Forms vs Template-driven ?

Les formulaires **réactifs** centralisent la validation dans le composant (`FormGroup`, `Validators`), facilitent les tests et le contrôle du bouton désactivé. Le template-driven mélange logique et vue, moins adapté à un formulaire structuré comme `contact`.

### 8. Relations via URLs ?

Les champs `episode`, `residents`, `characters` sont des URLs. On extrait l'id avec `url.split('/').pop()` (voir `extractIdFromUrl`), puis `getMany([ids])` sur l'API REST `/character/1,2,3`.

### 9. Lazy loading `favoris` et `contact` ?

Ces pages ne sont chargées **qu'à la navigation** (`loadComponent`), ce qui allège le bundle initial et accélère le premier affichage.

### 10. *(Bonus GraphQL)* GraphQL vs REST

En REST, la liste des personnages ne renvoie que des URLs d'épisodes ; il faut N+1 appels pour les détails. En GraphQL, une requête avec `location { id name }` et `episode { id name }` récupère tout en **un seul aller-retour**, évitant l'under-fetching.

## Captures d'écran

Voir le dossier [`screenshots/`](screenshots/) — à compléter avant le rendu (liste dans `screenshots/README.md`).

## Auteur

Projet TP Angular — Rick & Morty Explorer.
