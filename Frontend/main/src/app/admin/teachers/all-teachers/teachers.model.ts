export class Teacher {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  cin?: string;
  adresse?: string;
  situationParentale?: string;
  compteVerifie: boolean;

  constructor(data: any = {}) {
    this.id_utilisateur = data.id_utilisateur || 0;
    this.nom = data.nom || '';
    this.prenom = data.prenom || '';
    this.email = data.email || '';
    this.telephone = data.telephone || '';
    this.cin = data.cin || '';
    this.adresse = data.adresse || '';
    this.situationParentale = data.situationParentale || '';
    this.compteVerifie = data.compteVerifie !== undefined ? data.compteVerifie : true;
  }

  get fullName(): string {
    return `${this.prenom} ${this.nom}`;
  }
}
