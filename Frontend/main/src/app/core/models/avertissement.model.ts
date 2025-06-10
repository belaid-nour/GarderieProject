export enum Severite {
  LEGERE = 'LEGERE',
  MODEREE = 'MODEREE',
  GRAVE = 'GRAVE'
}

export interface User {
  id: number;
  nom: string;
}

export interface Enfant {
  id: number;
  nom: string;
    prenom: string;

  classeId?: number;
}
export interface Avertissement {
  id?: number;
  titre: string;
  description: string;
  severite: Severite;
  dateCreation?: Date | null; // Ajoutez | null ici
  enseignant: User;
  enfant: Enfant;
}
export interface AvertissementDTO {
  id?: number;

  titre: string;
  description: string;
  severite: Severite;
  dateCreation?: string;

  enseignantId: number;
  enfantId: number;

  enfantNomComplet?: string; // optionnel, calculé côté backend
}

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
}
