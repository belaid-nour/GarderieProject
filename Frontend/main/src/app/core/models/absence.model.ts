import { Seance } from './seance.model'; // à créer ou adapter selon ta structure

export interface Absence {
  id: number;
  enfantId?: number;
  enfant?: { prenom: string; nom: string }; // ajoute enfant info
  seanceId: number;
  seance?: Seance;
  classe?: { id: number; nom: string }; // info classe pour affichage
  date: string;
  raison?: string | null;
  justifiee: boolean;
}
