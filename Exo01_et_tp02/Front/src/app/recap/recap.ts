import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Pollution } from '../pollution.model';

@Component({
  selector: 'app-recap',
  imports: [DatePipe],
  templateUrl: './recap.html',
  styleUrl: './recap.css',
})
export class Recap {
  @Input({ required: true }) pollution!: Pollution;
  @Output() nouvelle = new EventEmitter<void>();
}