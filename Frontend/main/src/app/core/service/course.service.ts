import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CourseDTO } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = `http://localhost:8081/api/courses`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  uploadCourse(file: File, courseDto: Partial<CourseDTO>): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', courseDto.title || '');
    formData.append('description', courseDto.description || '');
    formData.append('classeId', courseDto.classeId?.toString() || '');

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  updateCourse(courseDto: CourseDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseDto.id}`, courseDto, {
      headers: this.getAuthHeaders()
    });
  }

  downloadCourse(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }

  getCoursesByClasse(classeId: number): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/classe/${classeId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(() => of([] as CourseDTO[]))
    );
  }

  getCoursesByTeacher(): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/teacher/me`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
