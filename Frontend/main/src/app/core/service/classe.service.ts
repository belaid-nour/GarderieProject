import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Classe } from '../models/classe.model';
import { Enfant } from '../models/students.model';

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private apiUrl = 'http://localhost:8081/api/classes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  // Nouvelle méthode ajoutée
  getEnfantsByClasseId(classeId: number): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(`${this.apiUrl}/${classeId}/enfants`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur API:', error);
        return throwError(() => new Error(
          error.error?.message || 'Erreur de chargement des élèves'
        ));
      })
    );
  }


getClasseById(id: number): Observable<Classe> {
  return this.http.get<Classe>(`${this.apiUrl}/${id}`, {
    headers: this.getAuthHeaders()
  }).pipe(
    catchError(error => {
      console.error('Erreur API:', error);
      return throwError(() => new Error('Classe introuvable'));
    })
  );
}
  getAllClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur API:', error);
        return throwError(() => new Error(
          error.error?.message || 'Erreur de chargement des classes'
        ));
      })
    );
  }
}


