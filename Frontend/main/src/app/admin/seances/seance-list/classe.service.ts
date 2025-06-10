import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from './seance.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8081/api/classes';

  constructor(private http: HttpClient) { }

  getAllClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl);
  }
}
