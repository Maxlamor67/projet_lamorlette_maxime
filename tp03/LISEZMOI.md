# TP03 – Pollutions (version la plus simple)

## 1. Lancer l'API mockée (json-server)
cd api
npm install
npm start          # http://localhost:3000/pollutions

## 2. Dans ton projet Angular existant (dossier Front)
ng generate environments          # crée les 2 fichiers environment (Angular 15+)
Copie les fichiers de Front/src dans ton projet (écrase app.routes.ts, app.config.ts, app.component.ts si besoin).
ng serve

## 3. Git
git checkout -b tp03
git add . && git commit -m "TP03"
git push -u origin tp03     # puis ouvrir la PR sur GitHub

## 4. Render
- API : Web Service, root dir = api, build = npm install, start = npm start
- Front : Static Site, root dir = Front, build = npm install && ng build, publish = dist/<nom>/browser
- Mets l'URL de l'API Render dans Front/src/environments/environment.ts
