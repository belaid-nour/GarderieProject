import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Seance } from './seance.model';
import { Enfant} from './seance.model';

import { AuthService } from '@core/service/auth.service';
import { SeanceDTO } from './seance.dto';

@Injectable({ providedIn: 'root' })
export class SeanceService {
  private apiUrl = 'http://localhost:8081/api/seances';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getCurrentTeacherId(): number {
    const teacher = this.authService.currentUserValue;
    if (!teacher) {
      throw new Error('Aucun enseignant connecté');
    }
    return teacher.id_utilisateur;
  }
// Dans seance.service.ts
getElevesByClasse(classeId: number): Observable<Enfant[]> {
  return this.http.get<Enfant[]>(
    `http://localhost:8081/api/classes/${classeId}/enfants`
  ).pipe(
    catchError(error => {
      console.error('Erreur chargement élèves:', error);
      return throwError(() => 'Échec du chargement des élèves');
    })
  );
}
  // Créer une nouvelle séance
  createSeance(seanceDTO: SeanceDTO, classeId: number): Observable<Seance> {
    const teacherId = this.getCurrentTeacherId();
    return this.http.post<Seance>(
      `${this.apiUrl}/${classeId}/${teacherId}`,
      seanceDTO
    ).pipe(
      catchError(error => {
        console.error('Erreur création séance:', error);
        return throwError(() => new Error('Échec de la création de la séance'));
      })
    );
  }

  // Mettre à jour une séance existante
  updateSeance(id: number, seanceDetails: Seance): Observable<Seance> {
    return this.http.put<Seance>(
      `${this.apiUrl}/${id}`,
      seanceDetails
    ).pipe(
      catchError(error => {
        console.error('Erreur mise à jour séance:', error);
        return throwError(() => new Error('Échec de la mise à jour de la séance'));
      })
    );
  }

  // Supprimer une séance
  deleteSeance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erreur suppression séance:', error);
        return throwError(() => new Error('Échec de la suppression de la séance'));
      })
    );
  }

  // Récupérer une séance par son ID
  // seance.service.ts
getSeanceById(id: number): Observable<Seance> {
  return this.http.get<Seance>(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      console.error('Erreur détaillée:', error);
      return throwError(() =>
        new Error(`Échec de récupération (${error.status}): ${error.message}`)
      );
    })
  );
}
  // Récupérer les séances par classe (existant)
  getSeancesByClasse(classeId: number): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.apiUrl}/classe/${classeId}`).pipe(
      catchError(error => {
        console.error('Erreur récupération séances:', error);
        return throwError(() => new Error('Échec du chargement des séances'));
      })
    );
  }

  // Récupérer les séances de l'enseignant connecté (existant)
  getTeacherSeances(): Observable<Seance[]> {
    try {
      const teacherId = this.getCurrentTeacherId();
      return this.http.get<Seance[]>(`${this.apiUrl}/enseignant/${teacherId}`).pipe(
        catchError(error => {
          console.error('Erreur API:', error);
          return throwError(() => new Error('Échec du chargement des séances'));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}
