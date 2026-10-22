# Exercice 02 : Service client (inscription)

Application Angular qui permet à un utilisateur de s'inscrire. L'appel HTTP est encapsulé dans un service (`AuthService`) injecté dans un composant (`SignupComponent`). Le back est simulé par un mock Express.

## Prérequis

- Node.js (version 20 ou supérieure)
- Angular CLI : `npm install -g @angular/cli`

## Lancer le projet

Il faut deux terminaux ouverts en même temps.

### 1. Lancer le mock de l'API (terminal 1)

```bash
cd mock-api
npm install
npm start
```

Le terminal doit afficher : `Mock API sur http://localhost:3000/api`. Laissez-le ouvert.

### 2. Lancer l'application Angular (terminal 2)

À la racine du projet :

```bash
npm install
ng serve
```

Ouvrez ensuite http://localhost:4200.

## Tester

| Action | Résultat attendu |
|---|---|
| Valider le formulaire vide | Messages de validation, aucune requête envoyée |
| Remplir correctement et valider | Message de succès « Compte créé pour ... ! » |
| Réutiliser le même email | Message d'erreur « Cet email est déjà utilisé. » |

Les requêtes sont visibles dans l'onglet **Réseau** des outils de développement du navigateur (`POST /api/auth/signup`).

## Route du mock

`POST http://localhost:3000/api/auth/signup`

Corps de la requête :

```json
{ "username": "max", "email": "max@test.fr", "password": "123456" }
```

| Code | Signification |
|---|---|
| 201 | Compte créé |
| 400 | Champ manquant |
| 409 | Email déjà utilisé |

Les utilisateurs sont stockés en mémoire : ils disparaissent à chaque redémarrage du mock.

## Environnements

L'URL de l'API n'est pas écrite en dur dans le code. Elle vient de :

- `src/environments/environment.development.ts` : `http://localhost:3000/api` (utilisé par `ng serve`)
- `src/environments/environment.ts` : URL de production (utilisée par `ng build`)

## Structure

```
mock-api/                         Faux back Express
src/
├── environments/                 URL de l'API selon l'environnement
└── app/
    ├── models/signup.model.ts    Types des données envoyées et reçues
    ├── services/auth.service.ts  Appel HTTP d'inscription (HttpClient)
    └── components/signup/        Formulaire et affichage des résultats
```

