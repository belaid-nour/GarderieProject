import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seance, Classe} from '../models/seance.model';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {
  private apiUrl = 'http://localhost:8081/api/seances';

  constructor(private http: HttpClient) { }

  // Opérations CRUD existantes
  getAllSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.apiUrl);
  }

  getSeance(id: number): Observable<Seance> {
    return this.http.get<Seance>(`${this.apiUrl}/${id}`);
  }

  createSeance(seance: Seance, classeId: number, enseignantId: number): Observable<Seance> {
    return this.http.post<Seance>(`${this.apiUrl}/${classeId}/${enseignantId}`, seance);
  }

  updateSeance(id: number, seance: Seance): Observable<Seance> {
    return this.http.put<Seance>(`${this.apiUrl}/${id}`, seance);
  }

  deleteSeance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Nouveaux endpoints pour la récurrence
  createRecurringSeance(seance: Seance, classeId: number, enseignantId: number): Observable<Seance[]> {
    return this.http.post<Seance[]>(
      `${this.apiUrl}/recurring/${classeId}/${enseignantId}`,
      seance
    );
  }

  getSeancesByClasse(classeId: number): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.apiUrl}/classe/${classeId}`);
  }

  getSeancesByEnseignant(enseignantId: number): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.apiUrl}/enseignant/${enseignantId}`);
  }

  getSeancesByDateRange(classeId: number, startDate: string, endDate: string): Observable<Seance[]> {
    return this.http.get<Seance[]>(
      `${this.apiUrl}/by-date-range?classeId=${classeId}&startDate=${startDate}&endDate=${endDate}`
    );
  }
}
