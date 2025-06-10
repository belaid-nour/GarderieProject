import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Parent } from './parent.model';

@Injectable({
  providedIn: 'root',
})
export class ParentsService {
  private readonly API_URL = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getAllParents(): Observable<Parent[]> {
    return this.http.get<any[]>(`${this.API_URL}/parents`).pipe(
      map(users => users.map(user => new Parent(user))),
      catchError(this.handleError)
    );
  }

  getParentById(id: number): Observable<Parent> {
    if (isNaN(id)) {
      return throwError(() => new Error('ID parent invalide'));
    }

    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(parentData => new Parent(parentData)),
      catchError(error => {
        console.error(`Erreur lors de la récupération du parent ${id}:`, error);
        return this.handleError(error);
      })
    );
  }

  createParent(parent: Parent): Observable<Parent> {
    return this.http.post<any>(this.API_URL, parent).pipe(
      map(response => new Parent(response)),
      catchError(this.handleError)
    );
  }

  updateParent(id: number, parent: Partial<Parent>): Observable<void> {
    return this.http.put(`${this.API_URL}/${id}`, parent, {
      observe: 'response',
      responseType: 'text'
    }).pipe(
      map(response => {
        if (response.status === 200 || response.status === 204) {
          return;
        }
        throw new Error('Réponse inattendue');
      }),
      catchError(this.handleError)
    );
  }

  toggleActivation(id: number, actif: boolean): Observable<void> {
    return this.http.put(`${this.API_URL}/${id}/activation?actif=${actif}`, {}, {
      observe: 'response',
      responseType: 'text'
    }).pipe(
      map(response => {
        if (response.status === 200 || response.status === 204) return;
        throw new Error('Réponse inattendue lors de l\'activation');
      }),
      catchError(this.handleError)
    );
  }

  deleteParent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erreur inconnue';

    if (error.status === 0) {
      errorMessage = 'Connexion au serveur impossible';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Parent non trouvé';
    } else if (error.status === 400) {
      errorMessage = 'Données invalides';
    } else {
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }

    console.error('Erreur ParentsService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
