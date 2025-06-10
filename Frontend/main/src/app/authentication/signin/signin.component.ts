import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/service/auth.service';
import { Role } from '@core/models/role';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.getDashboardUrl()]);
    }

    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  private getDashboardUrl(): string {
    const user = this.authService.currentUserValue;
    switch (user?.role) {
      case Role.Admin: return '/admin/dashboard/main';
      case Role.Teacher: return '/teacher/dashboard';
      case Role.Parent: return '/student/dashboard';
      default: return '/authentication/signin';
    }
  }

  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';

    if (this.authForm.invalid) {
      this.showErrorToast('Erreur', 'Email et mot de passe sont obligatoires');
      this.loading = false;
      return;
    }

    const { email, password } = this.authForm.value;

    this.subs.sink = this.authService.login(email, password).subscribe({
      next: (user) => {
        this.showSuccessToast('Bienvenue!', 'Connexion réussie');
        this.router.navigate([this.getDashboardUrl()]);
      },
      error: (error) => {
        this.handleLoginError(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private handleLoginError(error: any) {
    this.loading = false;
    this.submitted = false;

    const errorResponse = this.normalizeErrorResponse(error);
    const { title, message, type } = this.getErrorDetails(errorResponse);

    if (type === 'error') {
      this.showErrorToast(title, message);
    } else {
      this.showWarningToast(title, message);
    }
  }

  private normalizeErrorResponse(error: any): any {
    if (error.error) {
      if (typeof error.error === 'object' && error.error !== null) {
        return {
          code: error.error.code || error.error.error || `HTTP_${error.status}`,
          message: error.error.message || error.error.msg || this.getDefaultMessageForStatus(error.status),
          status: error.status || 500
        };
      } else if (typeof error.error === 'string') {
        return {
          code: 'UNKNOWN_ERROR',
          message: error.error,
          status: error.status || 500
        };
      }
    }
    if (error.status) {
      return {
        code: `HTTP_${error.status}`,
        message: this.getDefaultMessageForStatus(error.status),
        status: error.status
      };
    }
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'Une erreur inconnue est survenue',
      status: error.status || 500
    };
  }

  private getDefaultMessageForStatus(status: number | undefined): string {
    if (!status) return 'Une erreur est survenue';

    switch (status) {
      case 0: return 'Impossible de joindre le serveur';
      case 400: return 'Requête invalide';
      case 401: return 'Non autorisé : veuillez vérifier vos identifiants';
      case 403: return 'Accès refusé';
      case 404: return 'Ressource non trouvée';
      case 500: return 'Erreur serveur, veuillez réessayer plus tard';
      default: return `Erreur serveur (${status})`;
    }
  }

  private getErrorDetails(error: any): { title: string; message: string; type: 'error' | 'warning' } {
    const defaultResponse = {
      title: 'Erreur',
      message: error.message,
      type: 'error' as const
    };

    switch (error.code) {
      case 'INVALID_EMAIL':
        return {
          title: 'Email non enregistré',
          message: 'Cet email n\'est pas enregistré dans notre système',
          type: 'error'
        };
      case 'INVALID_CREDENTIALS':
        return {
          title: 'Identifiants incorrects',
          message: 'Email ou mot de passe incorrect',
          type: 'error'
        };
      case 'EMAIL_NOT_VERIFIED':
        return {
          title: 'Email non vérifié',
          message: 'Veuillez vérifier votre email avant de vous connecter',
          type: 'warning'
        };
      case 'ACCOUNT_DISABLED':
      case 'ACCOUNT_NOT_VERIFIED':
        return {
          title: 'Compte non activé',
          message: 'Votre compte n\'a pas encore été activé par l\'administration',
          type: 'warning'
        };
      case 'HTTP_401':
        return {
          title: 'Erreur d\'authentification',
          message: error.message || 'Identifiants incorrects',
          type: 'error'
        };
      case 'HTTP_0':
        return {
          title: 'Connexion impossible',
          message: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
          type: 'error'
        };
      case 'HTTP_403':
        return {
          title: 'Accès refusé',
          message: 'Vous n\'avez pas les permissions nécessaires',
          type: 'error'
        };
      case 'HTTP_500':
        return {
          title: 'Erreur serveur',
          message: 'Une erreur est survenue côté serveur. Veuillez réessayer plus tard.',
          type: 'error'
        };
      default:
        return defaultResponse;
    }
  }

  private showSuccessToast(title: string, message: string): void {
    this.showToast('success', title, message, 3000);
  }

  private showErrorToast(title: string, message: string): void {
    this.showToast('error', title, message, 5000);
  }

  private showWarningToast(title: string, message: string): void {
    this.showToast('warning', title, message, 5000);
  }

  private showToast(
    icon: 'success' | 'error' | 'warning',
    title: string,
    text: string,
    timer: number
  ): void {
    Swal.fire({
      position: 'top-end',
      icon,
      title,
      text,
      showConfirmButton: false,
      timer,
      toast: true,
      width: 400,
      background: '#f5f5f5',
      customClass: {
        title: 'text-sm',
        htmlContainer: 'text-sm'
      }
    });
  }
}
