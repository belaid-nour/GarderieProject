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
