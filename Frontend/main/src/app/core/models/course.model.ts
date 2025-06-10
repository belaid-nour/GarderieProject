// course.model.ts
export interface Course {
  id: number;
  title: string;
  description: string;
  fileName: string;
  uploadDate: Date;
  teacher: User;
  classe: Classe;
}

// course.model.ts
// course.model.ts
export interface CourseDTO {
  id: number;
  title: string;
  description: string;
  fileName: string;
  uploadDate: Date;
  classeId: number;
}

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  annee: string;
  effectifMax: number;
}

export interface User {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}
