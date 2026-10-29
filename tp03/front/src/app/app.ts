import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <header class="header">
      <h1>Gestion des pollutions</h1>
      <p>Signalez, suivez et filtrez les pollutions</p>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {}
