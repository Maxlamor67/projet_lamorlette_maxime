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
    <section class="card">
      <h2> Filtrer</h2>
      <div class="filters">
        <input [(ngModel)]="filtreTitre" placeholder="Titre...">
        <input [(ngModel)]="filtreLieu" placeholder="Lieu...">
        <select [(ngModel)]="filtreType">
          <option value="">Tous les types</option>
          <option>Plastique</option>
          <option>Air</option>
          <option>Eau</option>
          <option>Sol</option>
        </select>
      </div>
    </section>

    <p class="count">{{ filtrees().length }} pollution(s) trouvée(s)</p>

    <div class="grid">
      <article class="card item" *ngFor="let p of filtrees()">
        <span class="badge" [ngClass]="p.type.toLowerCase()">{{ p.type }}</span>
        <h3>{{ p.titre }}</h3>
        <p class="lieu"> {{ p.lieu }}</p>
        <p class="desc">{{ p.description }}</p>
        <div class="actions">
          <a class="btn ghost" [routerLink]="['/pollutions', p.id]">Détail</a>
          <button class="btn danger" (click)="supprimer(p.id!)">Supprimer</button>
        </div>
      </article>
    </div>

    <p class="empty" *ngIf="filtrees().length === 0">Aucune pollution trouvée.</p>

    <section class="card form">
      <h2> Ajouter une pollution</h2>
      <div class="form-grid">
        <div><label>Titre</label><input [(ngModel)]="nouvelle.titre" placeholder="Ex : Déchets plage"></div>
        <div><label>Type</label>
          <select [(ngModel)]="nouvelle.type">
            <option>Plastique</option>
            <option>Air</option>
            <option>Eau</option>
            <option>Sol</option>
          </select>
        </div>
        <div><label>Lieu</label><input [(ngModel)]="nouvelle.lieu" placeholder="Ex : Nice"></div>
        <div><label>Description</label><input [(ngModel)]="nouvelle.description" placeholder="Décris le problème"></div>
      </div>
      <br>
      <button class="btn" (click)="ajouter()">Ajouter</button>
    </section>
  `
})
export class PollutionListComponent implements OnInit {
  pollutions: Pollution[] = [];
  filtreTitre = '';
  filtreLieu = '';
  filtreType = '';
  nouvelle: Pollution = { titre: '', type: 'Plastique', lieu: '', description: '' };

  constructor(private service: PollutionService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.charger(); }

  charger() {
    this.service.getAll().subscribe(data => {
      this.pollutions = data;
      this.cdr.detectChanges();
    });
  }

  filtrees() {
    return this.pollutions.filter(p =>
      p.titre.toLowerCase().includes(this.filtreTitre.toLowerCase()) &&
      p.lieu.toLowerCase().includes(this.filtreLieu.toLowerCase()) &&
      (this.filtreType === '' || p.type === this.filtreType)
    );
  }

  ajouter() {
    this.service.create(this.nouvelle).subscribe(() => {
      this.nouvelle = { titre: '', type: 'Plastique', lieu: '', description: '' };
      this.charger();
    });
  }

  supprimer(id: string) {
    this.service.delete(id).subscribe(() => this.charger());
  }
}
