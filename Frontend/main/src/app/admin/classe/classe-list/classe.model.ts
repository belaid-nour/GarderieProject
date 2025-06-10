
import { Enfant } from './students.model';
export interface Classe {
  id: number;
  nom: string;
  niveau: string;
 annee: string;
  effectifMax: number;
  enfants: Enfant[];
   expanded?: boolean; 
}
