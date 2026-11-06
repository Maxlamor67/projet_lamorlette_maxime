import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="card auth-card">
      <p class="eyebrow">Espace utilisateur</p>
      <h2>Connexion</h2>
      <div class="status error" *ngIf="erreur">{{ erreur }}</div>
      <label for="login-username">Nom d'utilisateur</label>
      <input id="login-username" [(ngModel)]="username" (keyup.enter)="seConnecter()" placeholder="Votre nom d'utilisateur">
      <label for="login-password">Mot de passe</label>
      <input id="login-password" type="password" [(ngModel)]="password" (keyup.enter)="seConnecter()" placeholder="Mot de passe">
      <button class="btn" (click)="seConnecter()" [disabled]="chargement">Se connecter</button>
      <a class="back" routerLink="/users">Créer un compte</a>
    </section>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  erreur = '';
  chargement = false;

  constructor(private service: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

  seConnecter(): void {
    if (!this.username.trim() || this.password.length < 6) {
      this.erreur = "Le nom d'utilisateur et un mot de passe d'au moins 6 caractères sont obligatoires.";
      return;
    }
    this.chargement = true;
    this.service.login(this.username.trim(), this.password).subscribe({
      next: response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/pollutions']);
      },
      error: response => {
        this.erreur = response.error?.message || 'Connexion impossible.';
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}
