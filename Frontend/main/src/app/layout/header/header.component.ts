import { Component, Inject, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import {
  LanguageService,
  RightSidebarService,
  InConfiguration,
  Role,
  AuthService,
} from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatMenuModule, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationService } from '@core/service/notification.service';
import { finalize } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';


interface Notification {
  id: number;
  message: string;
  dateCreation: Date;
  lue: boolean;
  status: string;
  icon?: string;
  color?: string;
  time?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatButtonModule,
    MatMenuModule,
    MatMenuItem,
    MatIconModule,
    NgScrollbar,
    FeatherIconsComponent,
    MatToolbarModule,
    MatMenuTrigger,

  ]
})
export class HeaderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  public config: any;
  isNavbarCollapsed = true;
  homePage = '/';
  userImg = 'assets/images/profil-static.jpg';
  userName = 'Utilisateur';
  loading = false;
  unreadCount = 0;
  notifications: Notification[] = [];
  docElement?: HTMLElement;
  isFullScreen = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private configService: ConfigService,
      private dialog: MatDialog // <-- Ajouter cette ligne

  ) {
    super();
    this.docElement = document.documentElement;
  }

  ngOnInit() {
    this.config = this.configService.configData;
    this.initializeUserData();
    this.loadNotifications();
  }

  private initializeUserData() {
    const user = this.authService.currentUserValue;
    this.userName = user?.nom + ' ' + user?.prenom || 'Utilisateur';
    this.homePage = this.getHomePage(user?.role);
  }

  private getHomePage(role?: Role): string {
    switch(role) {
      case Role.Admin: return '/admin/dashboard/main';
      case Role.Teacher: return '/teacher/dashboard';
      case Role.Parent: return '/parent/dashboard';
      default: return '/admin/dashboard/main';
    }
  }

  private loadNotifications() {
    this.loading = true;
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications.map(n => ({
          ...n,
          dateCreation: new Date(n.dateCreation),
          status: n.lue ? 'msg-read' : 'msg-unread',
          icon: this.getNotificationIcon(n.message),
          color: this.getNotificationColor(n.message)
        }));
        this.unreadCount = notifications.filter(n => !n.lue).length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Erreur de chargement des notifications');
      }
    });
  }

  private getNotificationIcon(message: string): string {
    const msg = message.toLowerCase();
    if (msg.includes('message')) return 'message';
    if (msg.includes('paiement')) return 'payment';
    if (msg.includes('activité')) return 'notifications';
    if (msg.includes('urgence')) return 'warning';
    return 'info';
  }

  private getNotificationColor(message: string): string {
    const msg = message.toLowerCase();
    if (msg.includes('important')) return 'nfc-red';
    if (msg.includes('paiement')) return 'nfc-green';
    if (msg.includes('urgence')) return 'nfc-orange';
    return 'nfc-blue';
  }

  markNotificationAsRead(id: number) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && !notification.lue) {
      this.notificationService.markAsRead(id).subscribe({
        next: () => {
          notification.lue = true;
          notification.status = 'msg-read';
          this.unreadCount--;
        },
        error: () => console.error('Erreur de mise à jour')
      });
    }
  }

  markAllAsRead() {
    const unreadIds = this.notifications.filter(n => !n.lue).map(n => n.id);
    if (unreadIds.length > 0) {
      this.notificationService.markAllAsRead(unreadIds).subscribe({
        next: () => {
          this.notifications = this.notifications.map(n => ({
            ...n,
            lue: true,
            status: 'msg-read'
          }));
          this.unreadCount = 0;
        },
        error: () => console.error('Erreur de mise à jour')
      });
    }
  }

  callFullscreen() {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen) {
        this.docElement.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }

  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }

  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }

 logout() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: {
      title: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      confirmText: 'Déconnexion',
      cancelText: 'Annuler'
    },
    width: '400px'
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => { // <-- Ajouter le type ici
    if (confirmed) {
      this.authService.logout().subscribe({
        next: () => this.router.navigate(['/authentication/signin']),
        error: () => this.router.navigate(['/authentication/signin'])
      });
    }
  });
 }
}
