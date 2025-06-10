import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Notification {
  id: number;
  message: string;
  dateCreation: string;
  lue: boolean;
  parentId: number;
  absenceId: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8081/api/notifications';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getNotifications(): Observable<Notification[]> {
    const parentId = this.authService.currentUserValue?.id_utilisateur;
    return this.http.get<Notification[]>(`${this.apiUrl}/parent/${parentId}`).pipe(
      map(notifications =>
        notifications.sort((a, b) =>
          new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
        )
      )
    );
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/marquer-lue`, {});
  }

  markAllAsRead(notificationIds: number[]): Observable<void[]> {
    return forkJoin(notificationIds.map(id => this.markAsRead(id)));
  }
}
