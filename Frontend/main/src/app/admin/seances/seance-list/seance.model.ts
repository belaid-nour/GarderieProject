
// Interfaces mises à jour
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

export interface Classe {
  id: number;
  nom: string;
  niveau?: string;
  annee?: string;
  effectifMax?: number;
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
export interface Enseignant {
  id_utilisateur: number; // Supprimer le '?' pour le rendre obligatoire
  nom: string;
  prenom: string;
  // Ajouter les autres propriétés nécessaires
  email?: string;
  role?: string;
  telephone?: string;
}
