import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Pollution, TypePollution } from '../pollution.model';

function dateValide(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return { dateInvalide: true };
  if (d.getTime() > Date.now()) return { dateFuture: true };
  return null;
}

@Component({
  selector: 'app-pollution-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
})
export class PollutionForm {
  private fb = inject(FormBuilder);

  @Output() declarer = new EventEmitter<Pollution>();

  types: TypePollution[] = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  form = this.fb.group({
    titre: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    dateObservation: ['', [Validators.required, dateValide]],
    lieu: ['', Validators.required],
    latitude: [null as number | null,
      [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [null as number | null,
      [Validators.required, Validators.min(-180), Validators.max(180)]],
    photoUrl: ['', Validators.pattern(/^(https?:\/\/.+)?$/)],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.declarer.emit(this.form.getRawValue() as Pollution);
  }
}