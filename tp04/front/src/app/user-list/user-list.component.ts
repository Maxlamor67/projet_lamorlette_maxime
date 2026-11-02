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
    <section class="card">
      <p class="eyebrow">Gestion des comptes</p>
      <h2>Utilisateurs</h2>
      <div class="status error" *ngIf="erreur">{{ erreur }}</div>
      <div class="form-grid">
        <div>
          <label for="username">Nom d'utilisateur</label>
          <input id="username" [(ngModel)]="nouveau.username" placeholder="Ex : maxime">
        </div>
        <div>
          <label for="password">Mot de passe</label>
          <input id="password" type="password" [(ngModel)]="nouveau.password" placeholder="6 caractères minimum">
        </div>
      </div>
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
    if (!this.nouveau.username.trim() || !this.nouveau.password || this.nouveau.password.length < 6) {
      this.erreur = "Le nom d'utilisateur et un mot de passe d'au moins 6 caractères sont obligatoires.";
      return;
    }
    this.chargement = true;
    this.service.create({ username: this.nouveau.username.trim(), password: this.nouveau.password }).subscribe({
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
