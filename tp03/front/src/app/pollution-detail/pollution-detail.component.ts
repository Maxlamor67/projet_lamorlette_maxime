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
    <a class="back" routerLink="/pollutions">← Retour à la liste</a>
    <section class="card" *ngIf="pollution">
      <span class="badge" [ngClass]="pollution.type.toLowerCase()">{{ pollution.type }}</span>
      <h2>{{ pollution.titre }}</h2>
      <div class="form-grid">
        <div class="field"><label>Titre</label><input [(ngModel)]="pollution.titre"></div>
        <div class="field"><label>Type</label>
          <select [(ngModel)]="pollution.type">
            <option>Plastique</option>
            <option>Air</option>
            <option>Eau</option>
            <option>Sol</option>
          </select>
        </div>
        <div class="field"><label>Lieu</label><input [(ngModel)]="pollution.lieu"></div>
        <div class="field"><label>Description</label><input [(ngModel)]="pollution.description"></div>
      </div>
      <button class="btn" (click)="modifier()"> Enregistrer</button>
      <span class="ok">{{ message }}</span>
    </section>
  `
})
export class PollutionDetailComponent implements OnInit {
  pollution?: Pollution;
  message = '';

  constructor(private route: ActivatedRoute, private service: PollutionService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe(p => {
      this.pollution = p;
      this.cdr.detectChanges();
    });
  }

  modifier() {
    this.service.update(this.pollution!).subscribe(() => {
      this.message = 'Modifié ✔';
      this.cdr.detectChanges();
    });
  }
}
