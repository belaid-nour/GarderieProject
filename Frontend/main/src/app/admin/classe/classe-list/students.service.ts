import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Enfant } from './students.model';

@Injectable({
  providedIn: 'root'
})
export class EnfantService {
  private apiUrl = 'http://localhost:8081/api/enfants';

  constructor(private http: HttpClient) { }

  getAllEnfants(): Observable<Enfant[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        ...item,
        dateNaissance: new Date(item.dateNaissance),
        user: item.user || {}
      })))
    );
  }

  confirmEnfant(id: number): Observable<Enfant> {
    return this.http.post<Enfant>(`${this.apiUrl}/confirmer/${id}`, {});
  }

  disconfirmEnfant(id: number): Observable<Enfant> {
    return this.http.post<Enfant>(`${this.apiUrl}/disconfirmer/${id}`, {});
  }
  updateEnfant(id: number, enfant: Partial<Enfant>): Observable<Enfant> {
    return this.http.put<Enfant>(`${this.apiUrl}/${id}`, enfant);
  }

 addEnfantAdmin(enfantData: any, parentId: number): Observable<Enfant> {
    const payload = {
      ...enfantData,
      userId: parentId // Ajout de l'ID du parent sélectionné
    };

    return this.http.post<Enfant>(this.apiUrl, payload);
  }

}
