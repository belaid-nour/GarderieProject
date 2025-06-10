import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Teacher } from './teachers.model';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private readonly API_URL = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  // Récupère tous les enseignants
  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<any[]>(`${this.API_URL}/teachers`).pipe(
      map(users => users.map(user => new Teacher(user))),
      catchError(this.handleError)
    );
  }

  // Récupère un enseignant spécifique par ID
  getTeacherById(id: number): Observable<Teacher> {
    if (isNaN(id)) {
      return throwError(() => new Error('ID enseignant invalide'));
    }

    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(teacherData => new Teacher(teacherData)),
      catchError(error => {
        console.error(`Erreur lors de la récupération de l'enseignant ${id}:`, error);
        return this.handleError(error);
      })
    );
  }

  updateTeacher(id: number, teacher: Partial<Teacher>): Observable<void> {
    return this.http.put(`${this.API_URL}/${id}`, teacher, {
      observe: 'response', // Nous intéresse à toute la réponse
      responseType: 'text' // On s'attend à du texte (ou vide)
    }).pipe(
      map(response => {
        // Accepte les réponses vides ou non-JSON
        if (response.status === 200 || response.status === 204) {
          return;
        }
        throw new Error('Réponse inattendue');
      }),
      catchError(this.handleError)
    );
  }

  // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erreur inconnue';

    if (error.status === 0) {
      errorMessage = 'Connexion au serveur impossible';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }

    console.error('Erreur TeachersService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

// Dans teachers.service.ts
toggleActivation(id: number, actif: boolean): Observable<void> {
  return this.http.put(`${this.API_URL}/${id}/activation?actif=${actif}`, {}, {
    observe: 'response',
    responseType: 'text'
  }).pipe(
    map(response => {
      if (response.status === 200 || response.status === 204) return;
      throw new Error('Réponse inattendue lors de lactivation');
    }),
    catchError(this.handleError)
  );
}

}
