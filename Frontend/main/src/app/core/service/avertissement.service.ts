import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Ajoutez cette importation
import { Avertissement, AvertissementDTO } from '../models/avertissement.model';
import { Classe } from '../models/classe.model';
import { Enfant } from '../models/students.model';

@Injectable({
  providedIn: 'root'
})
export class AvertissementService {
  private apiUrl = 'http://localhost:8081/api/avertissements';
  private classesUrl = 'http://localhost:8081/api/classes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  // Ici on accepte un DTO (avec enseignantId et enfantId)
  creerAvertissement(avertissementDto: AvertissementDTO): Observable<Avertissement> {
    return this.http.post<Avertissement>(this.apiUrl, avertissementDto, {
      headers: this.getAuthHeaders()
    });
  }

  getAllAvertissements(): Observable<Avertissement[]> {
    return this.http.get<Avertissement[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

getAvertissementsByEnseignant(enseignantId: number): Observable<Avertissement[]> {
  return this.http.get<any[]>(`${this.apiUrl}/enseignant/${enseignantId}`, {
    headers: this.getAuthHeaders()
  }).pipe(
    map(avertissements => avertissements.map(av => ({
      ...av,
      dateCreation: av.dateCreation ? this.parseDate(av.dateCreation) : null
    }))
  ));
}

private parseDate(dateString: string): Date {
  // Essaye plusieurs formats de date
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
}


  getAvertissementById(id: number): Observable<Avertissement> {
    return this.http.get<Avertissement>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllClassesWithEnfants(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.classesUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getEnfantsByClasse(classeId: number): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(`${this.classesUrl}/${classeId}/enfants`, {
      headers: this.getAuthHeaders()
    });
  }
    getAvertissementsByEnfant(enfantId: number): Observable<Avertissement[]> {
    return this.http.get<Avertissement[]>(`${this.apiUrl}/enfant/${enfantId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(avertissements => avertissements.map(av => ({
        ...av,
        dateCreation: av.dateCreation ? new Date(av.dateCreation) : null
      })))
    );
  }

  deleteAvertissement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateAvertissement(id: number, avertissement: Avertissement): Observable<Avertissement> {
    return this.http.put<Avertissement>(`${this.apiUrl}/${id}`, avertissement, {
      headers: this.getAuthHeaders()
    });
  }
}
