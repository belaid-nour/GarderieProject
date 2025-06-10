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
  user?: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  userId: number;
}
