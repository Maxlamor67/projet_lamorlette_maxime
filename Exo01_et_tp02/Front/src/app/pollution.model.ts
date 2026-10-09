export type TypePollution =
  | 'Plastique'
  | 'Chimique'
  | 'Dépôt sauvage'
  | 'Eau'
  | 'Air'
  | 'Autre';

export interface Pollution {
  titre: string;
  type: TypePollution;
  description: string;
  dateObservation: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}