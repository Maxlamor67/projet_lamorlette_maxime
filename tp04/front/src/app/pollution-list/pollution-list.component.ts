import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Pollution } from '../pollution';
import { PollutionService } from '../pollution.service';

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="card filter-card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Surveillance environnementale</p>
          <h2>Rechercher une mesure</h2>
        </div>
        <span class="result-count">{{ filtrees().length }} résultat(s)</span>
      </div>
      <div class="filters">
        <input [(ngModel)]="filtreVille" placeholder="Rechercher une ville">
        <select [(ngModel)]="filtrePolluant">
          <option value="">Tous les polluants</option>
          <option>PM2.5</option>
          <option>PM10</option>
          <option>NO2</option>
          <option>O3</option>
          <option>CO2</option>
        </select>
        <input type="date" [(ngModel)]="filtreDate" aria-label="Filtrer par date">
      </div>
    </section>

    <div class="status error" *ngIf="erreur">{{ erreur }}</div>
    <p class="count">{{ pollutions.length }} mesure(s) enregistrée(s)</p>

    <div class="grid">
      <article class="card item" *ngFor="let p of filtrees()">
        <div class="item-topline">
          <span class="badge">{{ p.polluant }}</span>
          <span class="date">{{ p.date | date:'dd/MM/yyyy' }}</span>
        </div>
        <h3>{{ p.ville }}</h3>
        <p class="value">{{ p.valeur }} <span>µg/m³</span></p>
        <p class="desc">{{ p.description || 'Aucune description renseignée.' }}</p>
        <div class="actions">
          <a class="btn ghost" [routerLink]="['/pollutions', p.id]">Consulter</a>
          <button class="btn danger" (click)="supprimer(p.id!)">Supprimer</button>
        </div>
      </article>
    </div>

    <p class="empty" *ngIf="filtrees().length === 0">Aucune mesure trouvée.</p>

    <section class="card form">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Nouvelle entrée</p>
          <h2>Ajouter une mesure</h2>
        </div>
      </div>
      <div class="form-grid">
        <div><label for="ville">Ville</label><input id="ville" [(ngModel)]="nouvelle.ville" placeholder="Ex : Strasbourg"></div>
        <div><label for="polluant">Polluant</label>
          <select id="polluant" [(ngModel)]="nouvelle.polluant">
            <option>PM2.5</option>
            <option>PM10</option>
            <option>NO2</option>
            <option>O3</option>
            <option>CO2</option>
          </select>
        </div>
        <div><label for="valeur">Valeur</label><input id="valeur" type="number" min="0" step="0.1" [(ngModel)]="nouvelle.valeur" placeholder="Ex : 28.5"></div>
        <div><label for="date">Date</label><input id="date" type="date" [(ngModel)]="nouvelle.date"></div>
        <div class="wide"><label for="description">Description</label><textarea id="description" [(ngModel)]="nouvelle.description" placeholder="Décris la mesure"></textarea></div>
      </div>
      <button class="btn" (click)="ajouter()" [disabled]="chargement">Ajouter la mesure</button>
    </section>
  `
})
export class PollutionListComponent implements OnInit {
  pollutions: Pollution[] = [];
  filtreVille = '';
  filtrePolluant = '';
  filtreDate = '';
  erreur = '';
  chargement = false;
  nouvelle: Pollution = { ville: '', polluant: 'PM2.5', valeur: 0, date: '', description: '' };

  constructor(private service: PollutionService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.charger(); }

  charger() {
    this.chargement = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.pollutions = data;
        this.erreur = '';
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreur = 'Impossible de charger les mesures. Vérifiez que l’API est disponible.';
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrees() {
    return this.pollutions.filter(p =>
      p.ville.toLowerCase().includes(this.filtreVille.toLowerCase()) &&
      (this.filtrePolluant === '' || p.polluant === this.filtrePolluant) &&
      (this.filtreDate === '' || p.date === this.filtreDate)
    );
  }

  ajouter() {
    if (!this.nouvelle.ville.trim() || !this.nouvelle.date || !this.nouvelle.valeur) {
      this.erreur = 'La ville, la valeur et la date sont obligatoires.';
      return;
    }
    this.service.create(this.nouvelle).subscribe({
      next: () => {
        this.nouvelle = { ville: '', polluant: 'PM2.5', valeur: 0, date: '', description: '' };
        this.erreur = '';
        this.charger();
      },
      error: () => {
        this.erreur = 'Impossible d’ajouter la mesure.';
        this.cdr.detectChanges();
      }
    });
  }

  supprimer(id: number) {
    if (!confirm('Supprimer cette mesure ?')) return;
    this.service.delete(id).subscribe({
      next: () => this.charger(),
      error: () => {
        this.erreur = 'Impossible de supprimer la mesure.';
        this.cdr.detectChanges();
      }
    });
  }
}
