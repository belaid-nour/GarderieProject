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
  statutConfirmation: 'EN_ATTENTE' | 'CONFIRME' | 'REFUSE';
  description: string;
  total: number;
  typeInscription?: string;
  comportementEnfant?: string;
  personneAutorisee1Nom?: string;
  personneAutorisee1Prenom?: string;
  personneAutorisee2Nom?: string;
  personneAutorisee2Prenom?: string;
  userId: number;
  factures?: Facture[];
}

export interface Facture {
  id: number;
  statutPaiement: 'EN_ATTENTE' | 'PAYE' | 'ECHEC';
  montant: number;
  dateEmission: Date;
  datePaiement?: Date;
}
