import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <header class="header">
      <div class="header-inner">
        <p class="eyebrow">Observatoire des données</p>
        <h1>Suivi de la qualité de l’air</h1>
        <p>Consultez et gérez les mesures de pollution.</p>
      </div>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {}
