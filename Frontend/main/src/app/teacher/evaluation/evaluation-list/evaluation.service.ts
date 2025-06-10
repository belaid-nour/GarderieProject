import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Evaluation, EvaluationDTO } from './evaluation.model';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private apiUrl = 'http://localhost:8081/api/evaluations';

  constructor(private http: HttpClient) { }

  getEvaluationsBySeance(seanceId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/seance/${seanceId}`);
  }

  createEvaluation(evaluation: EvaluationDTO): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  updateEvaluation(id: number, evaluation: EvaluationDTO): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/${id}`, evaluation);
  }

  deleteEvaluation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
