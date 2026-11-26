export interface Pollution {
  id?: number;
  ville: string;
  valeur: number;
  polluant: string;
  date: string;
  description?: string | null;
}
