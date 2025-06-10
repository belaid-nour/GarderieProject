import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AssignClassTeacher } from './assign-class-teacher.model';

@Injectable({
  providedIn: 'root',
})
export class AssignClassTeacherService {
  private readonly API_URL = 'assets/data/assign-class-teacher.json';
  dataChange: BehaviorSubject<AssignClassTeacher[]> = new BehaviorSubject<
    AssignClassTeacher[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  get data(): AssignClassTeacher[] {
    return this.dataChange.value;
  }

  getDialogData(): AssignClassTeacher {
    return this.dialogData;
  }

  dialogData!: AssignClassTeacher;

  /** CRUD METHODS */

  /** GET: Fetch all class teacher assignments */
  getClassTeacherAssignList(): Observable<AssignClassTeacher[]> {
    return this.httpClient
      .get<AssignClassTeacher[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Assign a new class teacher */
  addClassTeacherAssignment(
    assignment: AssignClassTeacher
  ): Observable<AssignClassTeacher> {
    return this.httpClient
      .post<AssignClassTeacher>(this.API_URL, assignment)
      .pipe(
        map(() => assignment), // Return the added assignment
        catchError(this.handleError)
      );
  }

  /** PUT: Update an existing class teacher assignment */
  updateClassTeacherAssignment(
    assignment: AssignClassTeacher
  ): Observable<AssignClassTeacher> {
    return this.httpClient
      .put<AssignClassTeacher>(`${this.API_URL}`, assignment)
      .pipe(
        map(() => assignment), // Return the updated assignment
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove a class teacher assignment by ID */
  deleteClassTeacherAssignment(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => id), // Return the ID of the deleted assignment
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
