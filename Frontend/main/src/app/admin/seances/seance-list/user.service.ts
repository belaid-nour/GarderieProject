import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './seance.model';
import { Enseignant } from './seance.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) { }

  // Récupérer tous les enseignants
  getTeachers(): Observable<Enseignant[]> {
    return this.http.get<User[]>(`${this.apiUrl}/teachers`).pipe(
      map(users => users.map(user => ({
        id_utilisateur: user.id_utilisateur!,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        telephone: user.telephone
      })))
    );
  }


  // Récupérer un enseignant par ID
  getTeacherById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un enseignant
  updateTeacher(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Changer le statut d'activation
  toggleTeacherStatus(id: number, active: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activation`, { actif: active });
  }

  // Changer le mot de passe
  changePassword(id: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/password`, {
      oldPassword,
      newPassword
    });
  }

  // Récupérer tous les utilisateurs (optionnel)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
