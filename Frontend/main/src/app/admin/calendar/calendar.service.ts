import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, firstValueFrom } from 'rxjs';
import { Calendar } from './calendar.model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { EventInput } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly API_URL = 'http://localhost:8081/api/calendar';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  dataChange: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  dialogData!: Calendar;

  constructor(private httpClient: HttpClient) {}

  get data(): Calendar[] {
    return this.dataChange.value;
  }

  getDialogData(): Calendar {
    return this.dialogData;
  }

  getAllCalendars(): Observable<Calendar[]> {
    return this.httpClient
      .get<Calendar[]>(this.API_URL)
      .pipe(catchError(this.errorHandler));
  }

  getEvents(): Observable<EventInput[]> {
    return this.httpClient.get<Calendar[]>(this.API_URL).pipe(
      map((events) =>
        events.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          className: event.category,
          groupId: event.category,
          details: event.details,
          allDay: false,
        }))
      ),
      catchError(this.errorHandler)
    );
  }

  // ✅ Méthode corrigée avec firstValueFrom
  async loadEvents(): Promise<EventInput[]> {
    return await firstValueFrom(this.getEvents());
  }

  addCalendar(calendar: Calendar): Observable<Calendar> {
    return this.httpClient
      .post<Calendar>(this.API_URL, calendar, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  updateCalendar(calendar: Calendar): Observable<Calendar> {
    return this.httpClient
      .put<Calendar>(`${this.API_URL}/${calendar.id}`, calendar, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  deleteCalendar(id: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
