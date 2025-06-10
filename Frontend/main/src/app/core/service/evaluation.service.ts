// evaluation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8081/api/evaluations';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }




  getByEnfant(enfantId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/enfant/${enfantId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(evals => evals.map(this.mapEvaluation)),
      catchError(this.handleError)
    );
  }

  getByClasse(classeId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/classe/${classeId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(evals => evals.map(this.mapEvaluation)),
      catchError(this.handleError)
    );
  }

  getBySeance(seanceId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/seance/${seanceId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(evals => evals.map(this.mapEvaluation)),
      catchError(this.handleError)
    );
  }

  reanalyze(evaluationId: number): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiUrl}/${evaluationId}/reanalyse`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(this.mapEvaluation),
      catchError(this.handleError)
    );
  }

  private mapEvaluation(evaluation: Evaluation): Evaluation {
    return {
      ...evaluation,
      date: new Date(evaluation.date),
      // Pas besoin de mapper seance car c'est juste un ID dans votre cas
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erreur serveur inconnue';
    if (error.status === 0) {
      errorMessage = 'Serveur injoignable - Vérifiez votre connexion internet';
    } else if (error.error?.errorCode && error.error?.message) {
      errorMessage = `${error.error.errorCode} : ${error.error.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
export interface Evaluation {
  id: number;
  date: Date; // Changé de string | Date à Date seulement
  commentaire: string;
  sentiment?: 'POSITIF' | 'NÉGATIF' | 'NEUTRE' | string;
  confidence?: number;
  themes?: string[];
  suggestions?: string[];
  enfant: {
    id: number;
    prenom: string;
    nom: string;
    user?: {
      telephone: string;
    };
  };
  seanceId: number;
}

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
  age: number;
  total: number;
  typeInscription: string;
  comportementEnfant: string;
  personneAutorisee1Nom?: string;
  personneAutorisee1Prenom?: string;
  personneAutorisee2Nom?: string;
  personneAutorisee2Prenom?: string;
  user?: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  userId: number;

  // 🔥 Ces deux lignes sont importantes
  classeId?: number;      // ← utilisée pour rechercher une classe
  classe?: Classe;        // ← peut être remplie dans d’autres cas
}

// src/app/core/models/classe.model.ts
export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  annee: string;
  effectifMax: number;
    enfants?: Enfant[];

}
