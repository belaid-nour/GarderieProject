// src/app/admin/chat/chat.routes.ts
import { Route } from '@angular/router';
import {AdminChatComponent} from './chat.component';

export const CHAT_ROUTE: Route[] = [
  {
    path: '', // default route for /admin/chat
    component: AdminChatComponent}
];