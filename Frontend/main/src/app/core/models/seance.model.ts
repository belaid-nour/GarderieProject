export interface Seance {
  id: number;
  nom: string;
  horaireDebut: string;
  horaireFin: string;
  obligatoire: boolean;
  lieu: string;
  startDate: string; // Format: 'dd/MM/yyyy'
  endDate: string;   // Format: 'dd/MM/yyyy'
  recurrenceType: 'AUCUNE' | 'HEBDOMADAIRE' | 'MENSUELLE';
  classe: Classe;
  enseignant: User;
}

// src/app/core/models/classe.model.ts
export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  annee: string;
  effectifMax: number;
  enfants: Enfant[];
}
// core/models/user.ts
import { Role } from './role'; // OK
export interface User {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  adresse?: string;
  cin: string;
  telephone: string;
  nomConjoint?: string;
  prenomConjoint?: string;
  telephoneConjoint?: string;
  situationParentale?: string;
  role: Role;
  emailVerifie?: boolean;
  compteVerifie?: boolean;
  userImg?: string;     // optionnel pour affichage
  token?: string;       // optionnel pour frontend auth
}
export interface Enfant {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  niveau: string;
  sexe: string;
  bus: boolean;
  club: boolean;
  gouter: boolean;
  tablier: boolean;
  livre: boolean;
  rangDansFamille: number;
  nombreFrere: number;
  nombreSoeur: number;
  confirmed: boolean;
  description: string;
  paye: boolean;
  age: number;
  total: number;
  typeInscription: string;
  comportementEnfant: string;
  personneAutorisee1Nom?: string;
  personneAutorisee1Prenom?: string;
  personneAutorisee2Nom?: string;
  personneAutorisee2Prenom?: string;
  user?: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  userId: number;
classe?: Classe;
}
