import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, FormsModule],
})
export class AdminChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  filtre: 'tous' | 'en-attente' | 'traite' = 'tous';

  breadscrums = [
    {
      title: 'Gestion des réclamations',
      items: ['Tableau de bord', 'Réclamations'],
      active: 'Liste',
    },
  ];

  reclamationSelectionnee?: ChatMessage;
  reponseTexte: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatService.getAllMessages().subscribe({
      next: (msgs) => (this.messages = msgs),
      error: (err) => console.error('Erreur chargement :', err),
    });
  }

  changerStatut(msg: ChatMessage) {
    const nouveauStatut = !msg.traite;
    this.chatService.updateStatus(msg.id, nouveauStatut).subscribe({
      next: () => {
        msg.traite = nouveauStatut;
      },
      error: () => {
        alert('Erreur lors de la mise à jour du statut.');
      },
    });
  }

  selectionnerReclamation(msg: ChatMessage) {
    this.reclamationSelectionnee = msg;
    this.reponseTexte = msg.reponseAuto || '';
  }

  annulerReponse() {
    this.reclamationSelectionnee = undefined;
    this.reponseTexte = '';
  }

  envoyerReponse() {
    if (!this.reclamationSelectionnee) return;

    this.chatService.repondre(this.reclamationSelectionnee.id, this.reponseTexte).subscribe({
      next: () => {
        alert('Réponse envoyée avec succès');
        this.reclamationSelectionnee!.reponseAuto = this.reponseTexte;
        this.annulerReponse();
      },
      error: () => alert("Erreur lors de l'envoi de la réponse"),
    });
  }

  get messagesFiltres(): ChatMessage[] {
    switch (this.filtre) {
      case 'traite':
        return this.messages.filter((m) => m.traite === true);
      case 'en-attente':
        return this.messages.filter((m) => m.traite === false);
      default:
        return this.messages;
    }
  }
}
