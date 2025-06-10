import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from './chat.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:8081/api/reclamations';

  constructor(private http: HttpClient) {}

  sendMessage(parentId: number, message: ChatMessage): Observable<ChatMessage> {
    // Envoi du message lié à un parent
    return this.http.post<ChatMessage>(`${this.apiUrl}/parent/${parentId}`, message);
  }

  getMessagesByParent(parentId: number): Observable<ChatMessage[]> {
    // Récupère les messages pour un parent donné
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/parent/${parentId}`);
  }

  getAllMessages(): Observable<ChatMessage[]> {
    // Récupère toutes les réclamations pour l'admin
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/admin`);
  }

  updateStatus(id: number, traite: boolean): Observable<any> {
    // Met à jour le statut "traité" d'une réclamation
    return this.http.put(`${this.apiUrl}/${id}/status?traite=${traite}`, {});
  }

getReclamationsByParent(parentId: number): Observable<ChatMessage[]> {
  return this.http.get<ChatMessage[]>(`/api/reclamations/parent/${parentId}`);
}

}
