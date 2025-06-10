import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Absence } from './absence.model';

@Injectable({ providedIn: 'root' })
export class AbsenceService {
  private apiUrl = 'http://localhost:8081/api/absences';

  constructor(private http: HttpClient) { }

  getAbsencesBySeance(seanceId: number): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${this.apiUrl}/seance/${seanceId}`);
  }

  createAbsence(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(this.apiUrl, {
      enfantId: absence.enfantId,
      seanceId: absence.seanceId,
      present: absence.present,
      justifiee: absence.justifiee,
      date: absence.date
    });
  }

  updateAbsenceStatus(id: number, justifiee: boolean): Observable<Absence> {
    return this.http.put<Absence>(`${this.apiUrl}/${id}/statut?justifiee=${justifiee}`, {});
  }

  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
