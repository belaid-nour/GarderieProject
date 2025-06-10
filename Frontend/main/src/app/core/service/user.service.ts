import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '@core/models/user'; // Assurez-vous que le modèle User existe

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081';

  // Nouvelle méthode ajoutée
  getParents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users/parents`).pipe(
      catchError(error => {
        const errorMsg = error.error?.message || 'Erreur lors de la récupération des parents';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  // Méthodes existantes gardées intactes
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/users/${id}`, userData, { responseType: 'text' });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/users/me`);
  }

  updatePassword(userId: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/users/${userId}/password`,
      { oldPassword, newPassword }
    ).pipe(
      catchError(error => {
        let errorMsg = 'Erreur lors de la mise à jour du mot de passe';
        if (error.error?.message) errorMsg = error.error.message;
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
