import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <header class="header">
      <div class="header-inner">
        <nav class="nav">
          <a routerLink="/pollutions">Pollutions</a>
          <a routerLink="/users">Utilisateurs</a>
          <a routerLink="/login">Connexion</a>
          <button class="nav-button" *ngIf="auth.isAuthenticated()" (click)="deconnecter()">Déconnexion</button>
        </nav>
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
export class App {
  constructor(public auth: AuthService, private router: Router) {}

  deconnecter(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
