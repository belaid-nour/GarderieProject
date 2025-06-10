// classe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Classe } from './classe.model';
import { Enfant } from './students.model';

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private apiUrl = `http://localhost:8081/api/classes`;

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('Erreur:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  getAllClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createClasse(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe).pipe(
      catchError(this.handleError)
    );
  }
assignerEnfant(classeId: number, enfantId: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${classeId}/enfants/${enfantId}`, null).pipe(
    catchError(this.handleError)
  );
}
getEnfantsNonAssignes(niveau: string): Observable<Enfant[]> {
  return this.http.get<Enfant[]>(`${this.apiUrl}/enfants-non-assignes?niveau=${niveau}`).pipe(
    catchError(this.handleError)
  );
}

  updateClasse(id: number, classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${id}`, classe).pipe(
      catchError(this.handleError)
    );
  }

  deleteClasse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getClasseById(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
