# TP04 – Suivi de la qualité de l'air

## 1. Lancer l'API
cd api
npm install
Copier `.env.example` vers `.env`, puis renseigner le mot de passe PostgreSQL local.
npm run dev       # http://localhost:3000

Les variables `DATABASE_URL` (ou `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
et `DB_NAME`) doivent être définies pour PostgreSQL. `DB_SSL=true` active SSL.
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
- `GET /api/pollutions` : lister les mesures
- `GET /api/pollutions/:id` : consulter une mesure
- `POST /api/pollutions` : créer une mesure
- `PUT /api/pollutions/:id` : modifier une mesure
- `DELETE /api/pollutions/:id` : supprimer une mesure
