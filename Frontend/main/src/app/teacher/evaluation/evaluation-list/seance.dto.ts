// seance.dto.ts
export interface SeanceDTO {
  nom: string;
  horaireDebut: string; // Format ISO "HH:mm"
  horaireFin: string;   // Format ISO "HH:mm"
  obligatoire: boolean;
  lieu: string;
  date: string;         // Format ISO "YYYY-MM-DD"
}
