export class Parent {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  motDePasse?: string;
  role: string;
  adresse?: string;
  cin?: string;
  nomConjoint?: string;
  prenomConjoint?: string;
  telephoneConjoint?: string;
  situationParentale?: string;
  emailVerifie: boolean;
  compteVerifie: boolean;

  constructor(data: any = {}) {
    this.id_utilisateur = data.id_utilisateur || 0;
    this.nom = data.nom || '';
    this.prenom = data.prenom || '';
    this.email = data.email || '';
    this.telephone = data.telephone || '';
    this.motDePasse = data.motDePasse || '';
    this.role = 'Parent'; // Set default role here
    this.adresse = data.adresse || '';
    this.cin = data.cin || '';
    this.nomConjoint = data.nomConjoint || '';
    this.prenomConjoint = data.prenomConjoint || '';
    this.telephoneConjoint = data.telephoneConjoint || '';
    this.situationParentale = data.situationParentale || '';
    this.emailVerifie = data.emailVerifie !== undefined ? data.emailVerifie : false;
    this.compteVerifie = data.compteVerifie !== undefined ? data.compteVerifie : true;
  }

  get fullName(): string {
    return `${this.prenom} ${this.nom}`;
  }

  get conjointFullName(): string {
    return `${this.prenomConjoint} ${this.nomConjoint}`;
  }
}
