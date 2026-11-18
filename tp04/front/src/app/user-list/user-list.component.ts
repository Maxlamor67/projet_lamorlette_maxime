import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="card auth-card register-card">
      <p class="eyebrow">Gestion des comptes</p>
      <h2>Utilisateurs</h2>
      <div class="status error" *ngIf="erreur">{{ erreur }}</div>
      <div class="register-form">
        <div>
          <label for="username">Nom d'utilisateur</label>
          <input id="username" [(ngModel)]="nouveau.username" placeholder="Ex : maxime">
        </div>
        <div>
          <label for="password">Mot de passe</label>
          <input id="password" type="password" [(ngModel)]="nouveau.password" placeholder="8 caractères, 1 majuscule, 1 caractère spécial">
        </div>
        <div>
          <label for="password-confirmation">Confirmer le mot de passe</label>
          <input id="password-confirmation" type="password" [(ngModel)]="nouveau.passwordConfirmation" placeholder="Retapez le mot de passe">
        </div>
      </div>
      <p class="password-help">Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial.</p>
      <button class="btn" (click)="ajouter()" [disabled]="chargement">Créer le compte</button>
    </section>

    <p class="count">{{ utilisateurs.length }} utilisateur(s)</p>
    <section class="grid">
      <article class="card item" *ngFor="let utilisateur of utilisateurs">
        <h3>{{ utilisateur.username }}</h3>
        <p class="desc">Identifiant : {{ utilisateur.id }}</p>
        <button class="btn danger" (click)="supprimer(utilisateur)">Supprimer</button>
      </article>
    </section>
    <p class="empty" *ngIf="utilisateurs.length === 0">Aucun utilisateur enregistré.</p>
  `
})
export class UserListComponent implements OnInit {
  utilisateurs: User[] = [];
  nouveau: User = { username: '' };
  erreur = '';
  chargement = false;

  constructor(private service: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.service.getAll().subscribe({
      next: users => {
        this.utilisateurs = users;
        this.erreur = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreur = 'Impossible de charger les utilisateurs.';
        this.cdr.detectChanges();
      }
    });
  }

  ajouter(): void {
    if (!this.nouveau.username.trim()) {
      this.erreur = "Le nom d'utilisateur est obligatoire.";
      return;
    }
    if (!this.nouveau.password || this.nouveau.password.length < 8 ||
        !/[A-Z]/.test(this.nouveau.password) || !/[^A-Za-z0-9]/.test(this.nouveau.password)) {
      this.erreur = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial.';
      return;
    }
    if (this.nouveau.password !== this.nouveau.passwordConfirmation) {
      this.erreur = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.chargement = true;
    this.service.create({
      username: this.nouveau.username.trim(),
      password: this.nouveau.password,
      passwordConfirmation: this.nouveau.passwordConfirmation
    }).subscribe({
      next: () => {
        this.nouveau = { username: '' };
        this.chargement = false;
        this.charger();
      },
      error: response => {
        this.erreur = response.error?.message || 'Impossible de créer le compte.';
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  supprimer(user: User): void {
    if (user.id === undefined || !confirm(`Supprimer ${user.username} ?`)) return;
    this.service.delete(user.id).subscribe({
      next: () => this.charger(),
      error: () => {
        this.erreur = 'Impossible de supprimer cet utilisateur.';
        this.cdr.detectChanges();
      }
    });
  }
}
