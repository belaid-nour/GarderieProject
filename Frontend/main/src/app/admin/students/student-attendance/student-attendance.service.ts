import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { StudentAttendance } from './student-attendance.model';

@Injectable({
  providedIn: 'root',
})
export class StudentAttendanceService {
  private readonly API_URL = 'assets/data/student-attendance.json';
  dataChange: BehaviorSubject<StudentAttendance[]> = new BehaviorSubject<
    StudentAttendance[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  get data(): StudentAttendance[] {
    return this.dataChange.value;
  }

  getDialogData(): StudentAttendance {
    return this.dialogData;
  }

  dialogData!: StudentAttendance;

  /** CRUD METHODS */

  /** GET: Fetch all student attendances */
  getAllStudentAttendances(): Observable<StudentAttendance[]> {
    return this.httpClient
      .get<StudentAttendance[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new student attendance */
  addStudentAttendance(
    studentAttendance: StudentAttendance
  ): Observable<StudentAttendance> {
    return this.httpClient
      .post<StudentAttendance>(this.API_URL, studentAttendance)
      .pipe(
        map(() => studentAttendance), // Return the added student attendance
        catchError(this.handleError)
      );
  }

  /** PUT: Update an existing student attendance */
  updateStudentAttendance(
    studentAttendance: StudentAttendance
  ): Observable<StudentAttendance> {
    return this.httpClient
      .put<StudentAttendance>(`${this.API_URL}`, studentAttendance)
      .pipe(
        map(() => studentAttendance), // Return the updated student attendance
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove a student attendance by ID */
  deleteStudentAttendance(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => id), // Return the ID of the deleted student attendance
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
