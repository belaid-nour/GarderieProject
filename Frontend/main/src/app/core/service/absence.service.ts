import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Absence } from '@core/models/absence.model';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private apiUrl = 'http://localhost:8081/api/absences';

  constructor(private http: HttpClient) {}

  getAbsencesByEnfant(enfantId: number): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${this.apiUrl}/enfant/${enfantId}`);
  }

  updateAbsenceStatus(absenceId: number, justifiee: boolean): Observable<Absence> {
    return this.http.put<Absence>(`${this.apiUrl}/${absenceId}/statut?justifiee=${justifiee}`, {});
  }
getAbsencesByClasse(classeId: number): Observable<Absence[]> {
  return this.http.get<Absence[]>(`${this.apiUrl}/classe/${classeId}`);
}

  deleteAbsence(absenceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${absenceId}`);
  }
}
