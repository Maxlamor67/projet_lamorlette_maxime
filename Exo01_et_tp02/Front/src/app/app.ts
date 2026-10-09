import { Component } from '@angular/core';
import { PollutionForm } from './pollution-form/pollution-form';
import { Recap } from './recap/recap';
import { Pollution } from './pollution.model';

@Component({
  selector: 'app-root',
  imports: [PollutionForm, Recap],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  declaration: Pollution | null = null;

  onDeclarer(p: Pollution): void {
    this.declaration = p;
  }
}