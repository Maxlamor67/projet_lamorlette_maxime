import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pollution } from '../pollution';
import { PollutionService } from '../pollution.service';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a class="back" routerLink="/pollutions">Retour à la liste</a>
    <section class="card" *ngIf="pollution">
      <p class="eyebrow">Détail de la mesure</p>
      <h2>{{ pollution.ville }}</h2>
      <div class="status error" *ngIf="erreur">{{ erreur }}</div>
      <div class="form-grid">
        <div class="field"><label for="detail-ville">Ville</label><input id="detail-ville" [(ngModel)]="pollution.ville"></div>
        <div class="field"><label for="detail-polluant">Polluant</label>
          <select id="detail-polluant" [(ngModel)]="pollution.polluant">
            <option>PM2.5</option>
            <option>PM10</option>
            <option>NO2</option>
            <option>O3</option>
            <option>CO2</option>
          </select>
        </div>
        <div class="field"><label for="detail-valeur">Valeur</label><input id="detail-valeur" type="number" min="0" step="0.1" [(ngModel)]="pollution.valeur"></div>
        <div class="field"><label for="detail-date">Date</label><input id="detail-date" type="date" [(ngModel)]="pollution.date"></div>
        <div class="field wide"><label for="detail-description">Description</label><textarea id="detail-description" [(ngModel)]="pollution.description"></textarea></div>
      </div>
      <button class="btn" (click)="modifier()">Enregistrer</button>
      <span class="ok">{{ message }}</span>
    </section>
  `
})
export class PollutionDetailComponent implements OnInit {
  pollution?: Pollution;
  message = '';
  erreur = '';

  constructor(private route: ActivatedRoute, private service: PollutionService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(Number(id)).subscribe({
      next: p => {
        this.pollution = p;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreur = 'Impossible de charger cette mesure.';
        this.cdr.detectChanges();
      }
    });
  }

  modifier() {
    this.service.update(this.pollution!).subscribe({
      next: () => {
        this.message = 'Mesure enregistrée.';
        this.erreur = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreur = 'Impossible d’enregistrer la mesure.';
        this.cdr.detectChanges();
      }
    });
  }
}
