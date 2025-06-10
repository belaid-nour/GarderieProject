export interface Evaluation {
  id: number;
  date: Date;
  commentaire: string;
  sentiment?: string;
  confidence?: number;
  themes?: string[];
  suggestions?: string[]; // Ajouté ici
  seanceId: number;
  seanceNom?: string;     // Nom de la séance (exemple)
  professeur?: string;    // Nom du professeur (exemple)
  enfant: {
    id: number;
    prenom: string;
    nom: string;
    classe?: {
      id: number;
      nom: string;
    };
  };
}
