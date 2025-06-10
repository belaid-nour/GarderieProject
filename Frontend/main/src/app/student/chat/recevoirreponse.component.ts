import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat/chat.service';
import { ChatMessage } from '../chat/chat.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-view-responses',
  templateUrl: './recevoirreponse.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
})
export class ViewResponsesComponent implements OnInit {
  parentId: number = 1; // À remplacer par l'ID réel du parent
  messages: ChatMessage[] = [];

  breadscrums = [
    {
      title: 'Réponses aux réclamations',
      items: ['Tableau de bord', 'Réclamations'],
      active: 'Réponses',
    },
  ];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatService.getMessagesByParent(this.parentId).subscribe({
      next: (messages) => (this.messages = messages),
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors du chargement des messages');
      },
    });
  }
}