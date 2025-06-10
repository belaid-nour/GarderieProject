// src/app/shared/models/shared.models.ts
export interface Classe {
  id: number;
  nom: string;
}

export interface Enfant {
  id: number;
  nom: string;
  prenom: string;
  classe: Classe;
}

export interface Seance {
  id: number;
  nom: string;
  startDate: string;    // Format ISO
  endDate: string | null;
  classe: Classe;
  obligatoire?: boolean;
  lieu?: string;
}

export interface SeanceDTO {
  nom: string;
  horaireDebut: string;
  horaireFin: string;
  startDate: string;
  endDate: string | null;
  obligatoire: boolean;
  lieu: string;
  recurrenceType: 'AUCUNE' | 'HEBDOMADAIRE' | 'MENSUELLE';
  idClasse: number;
}

export interface Absence {
  id?: number;
  enfantId: number;
  seanceId: number;
  date: string;
  raison?: string;
  justifiee: boolean;
  present: boolean;
  enfant?: Enfant;
  seance?: Seance;
}

export interface User {
  id_utilisateur: number;
  // autres propriétés...
}
