import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms'; // Import FormGroup
import { Router } from '@angular/router';
import { AuthService } from '@core/service/auth.service';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class ForgotPasswordComponent {
  authForm: FormGroup; // Formulaire pour l'email

  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Service pour gérer l'authentification
    private router: Router
  ) {
    // Initialisation du formulaire avec un contrôle pour l'email
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]] // Validation de l'email
    });
  }

  // Récupération des contrôles pour faciliter l'accès dans le template
  get f() {
    return this.authForm.controls;
  }

  // Fonction de soumission du formulaire
  onSubmit(): void {
    this.submitted = true;

    // Empêche la soumission si le formulaire est invalide
    if (this.authForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.authForm.value.email;

    // Appel au service pour réinitialiser le mot de passe
    this.authService.resetPassword(email).subscribe(
      (response) => {
        console.log(response.message);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'A new password reset link has been sent to your email address.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/signin']); // Redirection vers la page de connexion
      },
      (error) => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while resetting the password.',
        });
      }
    );
  }
}
