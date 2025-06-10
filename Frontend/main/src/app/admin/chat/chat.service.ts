import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from './chat.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:8081/api/reclamations';

  constructor(private http: HttpClient) {}

  sendMessage(parentId: number, message: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.apiUrl}/parent/${parentId}`, message);
  }

  getMessagesByParent(parentId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/parent/${parentId}`);
  }
updateStatus(reclamationId: number, traite: boolean): Observable<any> {
  return this.http.put(`${this.apiUrl}/${reclamationId}/status?traite=${traite}`, {});
}
repondre(reclamationId: number, reponseAdmin: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/${reclamationId}/reponse`, { reponseAdmin });
}

  getAllMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/admin`);
  }
}
