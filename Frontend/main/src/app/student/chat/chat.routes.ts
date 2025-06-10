// src/app/admin/chat/chat.routes.ts
import { Route } from '@angular/router';
import { SendComplaintComponent } from './chat.component';
import { ViewResponsesComponent } from './recevoirreponse.component';

export const CHAT_ROUTES: Route[] = [
  {
    path: 'envoyer',
    component: SendComplaintComponent
  },
  {
    path: 'reponses',
    component: ViewResponsesComponent
  },
  {
    path: '',
    redirectTo: 'envoyer',
    pathMatch: 'full'
  }
];