import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enfant } from '../models/students.model';

@Injectable({
  providedIn: 'root'
})
export class EnfantService {
  private apiUrl = 'http://localhost:8081/api/enfants';

  constructor(private http: HttpClient) { }

  addEnfant(enfant: Omit<Enfant, 'id'>): Observable<Enfant> {
    return this.http.post<Enfant>(this.apiUrl, enfant);
  }

  deleteEnfant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateEnfant(id: number, enfant: Enfant): Observable<Enfant> {
    return this.http.put<Enfant>(`${this.apiUrl}/${id}`, enfant);
  }

  getEnfantById(id: number): Observable<Enfant> {
    return this.http.get<Enfant>(`${this.apiUrl}/${id}`);
  }
     getMesEnfants(): Observable<Enfant[]> {
        return this.http.get<Enfant[]>(`${this.apiUrl}/mes-enfants`);
      }

  // Récupérer les enfants par l'id du parent
  getEnfantsByParentId(parentId: number): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(`${this.apiUrl}/parent/${parentId}`);
  }
}
