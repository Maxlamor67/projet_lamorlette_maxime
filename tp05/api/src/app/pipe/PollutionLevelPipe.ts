import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pollutionLevel',
  standalone: true
})
export class PollutionLevelPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(Number(value)) || Number(value) < 0) {
      return 'Inconnu';
    }

    const niveau = Number(value);
    if (niveau <= 20) return 'Faible';
    if (niveau <= 50) return 'Modérée';
    if (niveau <= 100) return 'Élevée';
    return 'Dangereuse';
  }
}
