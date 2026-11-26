# TP04 – Suivi de la qualité de l'air

## 1. Lancer l'API
cd api
npm install
Copier `.env.example` vers `.env`, puis renseigner le mot de passe PostgreSQL local.
npm run dev       # http://localhost:3000

Les variables `DATABASE_URL` (ou `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
et `DB_NAME`) doivent être définies pour PostgreSQL. `DB_SSL=true` active SSL.
Définir également `AUTH_SECRET` avec une longue valeur aléatoire pour signer les
jetons de connexion.
Le fichier `.env` ne doit jamais être envoyé sur Git.

## Déployer l'API sur Render

Créer un service **Web Service** connecté au dépôt, avec le dossier racine
`api`, puis utiliser :

- Build Command : `npm install && npm run build`
- Start Command : `npm start`

Dans l'onglet **Environment**, ajouter `DATABASE_URL` avec l'URL interne de
la base PostgreSQL Render et `DB_SSL=true`. Render fournit automatiquement la
variable `PORT`; l'API l'utilise déjà et écoute sur `0.0.0.0`.

L'URL `https://adresse-de-ton-api.onrender.com/health` doit répondre :

```json
{"status":"OK"}
```

## 2. Lancer le front
cd front
npm install
npm start

En développement, le front utilise `http://localhost:3000`. Pour une version
déployée, renseigner l'URL publique de l'API dans
`front/src/environments/environment.ts`.

## Routes API
- `GET /api/users` : lister les utilisateurs
- `POST /api/users` : créer un utilisateur
- `POST /api/users/login` : connecter un utilisateur avec son nom et son mot de passe
- `GET /api/users/:id` : consulter un utilisateur
- `PUT /api/users/:id` : modifier un utilisateur
- `DELETE /api/users/:id` : supprimer un utilisateur

Les routes `/api/pollutions` nécessitent l'en-tête `Authorization: Bearer <token>`
retourné par la connexion. Le compte initial est `admin` avec le mot de passe
`admin123`, à modifier en production.
- `GET /api/pollutions` : lister les mesures
- `GET /api/pollutions/:id` : consulter une mesure
- `POST /api/pollutions` : créer une mesure
- `PUT /api/pollutions/:id` : modifier une mesure
- `DELETE /api/pollutions/:id` : supprimer une mesure


## TP05 – Guards, lazy loading et optimisation

Le frontend utilise des composants Angular standalone : le lazy loading est donc
réalisé avec `loadComponent()` et des imports dynamiques dans
`front/src/app/app.routes.ts` (il n'y a pas de NgModule à charger).

- `auth.guard.ts` protège les routes `/pollutions` et `/pollutions/:id` :
  un visiteur non connecté est redirigé vers `/login`.
- `guest.guard.ts` empêche un utilisateur déjà connecté d'afficher `/login`
  et le redirige vers `/pollutions`.
- Les composants des pages sont chargés à la demande avec `loadComponent()`.
- `ChangeDetectionStrategy.OnPush` est activé sur les pages de connexion,
  liste des pollutions, détail d'une pollution et liste des utilisateurs.

### Vérification

Depuis le dossier `front` :

```bash
npm install
npm run build
npm start
```

L'API doit être démarrée séparément depuis le dossier `api` :

```bash
npm install
npm run dev
```

### Workflow Git demandé

Depuis la racine du dépôt :

```bash
git switch -c tp05
git add .
git commit -m "TP05: guards, lazy loading et OnPush"
git push -u origin tp05
```

Créer ensuite une Pull Request de `tp05` vers `main` sur GitHub et demander
la validation au techlead et à l'enseignant.
