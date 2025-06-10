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

export interface Absence {
  id?: number;
  present: boolean;
  justifiee: boolean;
  date: string;
  enfant: Enfant;
  seance: Seance;
}

export interface SeanceDTO {
  nom: string;
  horaireDebut: string;
  horaireFin: string;
  obligatoire: boolean;
  lieu: string;
  date: string;
}
export interface Enseignant {
  id_utilisateur: number; // Supprimer le '?' pour le rendre obligatoire
  nom: string;
  prenom: string;
  // Ajouter les autres propriétés nécessaires
  email?: string;
  role?: string;
  telephone?: string;
}
