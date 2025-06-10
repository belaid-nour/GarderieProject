export interface ChatMessage {
  id: number;
  objet: string;
  message: string;
  dateEnvoi: string; // ou Date si tu le convertis
  parentId: number;
  parentNomComplet: string;
  traite: boolean;
  
  reponseAdmin: string | null;
  moderationStatus: string;
}
