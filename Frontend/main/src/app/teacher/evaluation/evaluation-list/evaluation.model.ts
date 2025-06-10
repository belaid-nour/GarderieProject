export interface Evaluation {
  id: number;
  commentaire: string;
  date: string;
  enfantId: number;
  seanceId: number;
  // Pour l'affichage
  enfant?: Enfant;
  seance?: Seance;
}

export interface EvaluationDTO {
  enfantId: number;
  seanceId: number;
  date: string;
  commentaire: string;
}
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

export interface User {
  id_utilisateur?: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  motDePasse?: string;
  adresse?: string;
  cin?: string;
  nomConjoint?: string;
  prenomConjoint?: string;
  telephoneConjoint?: string;
  situationParentale?: string;
  telephone?: string;
  salaire?: number;
  emailVerifie?: boolean;
  compteVerifie?: boolean;
}
export interface Seance {
  id: number;
  nom: string;
  date: string;
  horaire: string;
  lieu: string;
  classe: Classe;
}
export interface SeanceDTO {
  nom: string;
  horaireDebut: string; // Format ISO "HH:mm"
  horaireFin: string;   // Format ISO "HH:mm"
  obligatoire: boolean;
  lieu: string;
  date: string;         // Format ISO "YYYY-MM-DD"
}
