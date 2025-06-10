import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-send-complaint',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
})
export class SendComplaintComponent implements OnInit {
  parentId: number = 1; // À remplacer par l'ID réel du parent
  message: Partial<ChatMessage> = {
    objet: '',
    message: '',
    parentId: this.parentId,
  };

  breadscrums = [
    {
      title: 'Envoyer une réclamation',
      items: ['Tableau de bord', 'Réclamations'],
      active: 'Envoyer',
    },
  ];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  sendMessage(): void {
    if (!this.message.objet?.trim() || !this.message.message?.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.chatService.sendMessage(this.parentId, this.message as ChatMessage).subscribe({
      next: () => {
        this.message = { objet: '', message: '', parentId: this.parentId };
        alert('Réclamation envoyée avec succès');
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de l\'envoi');
      },
    });
  }
}