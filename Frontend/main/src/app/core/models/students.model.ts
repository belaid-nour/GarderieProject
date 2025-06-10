
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

  // 🔥 Ces deux lignes sont importantes
  classeId?: number;      // ← utilisée pour rechercher une classe
  classe?: Classe;        // ← peut être remplie dans d’autres cas
}

// src/app/core/models/classe.model.ts
export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  annee: string;
  effectifMax: number;
    enfants?: Enfant[];

}
