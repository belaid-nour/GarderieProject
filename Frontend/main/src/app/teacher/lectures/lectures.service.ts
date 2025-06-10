import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Lectures } from './lectures.model';

@Injectable({
  providedIn: 'root',
})
export class LecturesService {
  private readonly API_URL = 'assets/data/lectures.json';
  dataChange: BehaviorSubject<Lectures[]> = new BehaviorSubject<Lectures[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** CRUD METHODS */

  /** GET: Fetch all lectures */
  getAllLectures(): Observable<Lectures[]> {
    return this.httpClient.get<Lectures[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data); // Update the BehaviorSubject with the fetched data
        return data; // Return the fetched data
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new lecture */
  addLectures(lectures: Lectures): Observable<Lectures> {
    return this.httpClient.post<Lectures>(this.API_URL, lectures).pipe(
      map((response) => {
        return lectures; // Return the added lecture
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing lecture */
  updateLectures(lectures: Lectures): Observable<Lectures> {
    return this.httpClient.put<Lectures>(`${this.API_URL}`, lectures).pipe(
      map((response) => {
        return lectures; // Return the updated lecture
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a lecture by ID */
  deleteLectures(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted lecture
      }),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
