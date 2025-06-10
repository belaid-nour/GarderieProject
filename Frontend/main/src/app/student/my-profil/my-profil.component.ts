import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/service/auth.service';
import { UserService } from '@core/service/user.service';
import { User } from '@core/models/user';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-mon-profil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    BreadcrumbComponent
  ],
  templateUrl: './my-profil.component.html',
  styleUrls: ['./my-profil.component.scss']
})
export class MonProfilComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  user?: User;
  passwordForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.initializeForm();
    this.loadUserData();
  }

  initializeForm() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  loadUserData() {
    const userId = this.authService.currentUserValue?.id_utilisateur;
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => this.user = user,
        error: (err) => console.error('Erreur de chargement du profil:', err)
      });
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid && this.user?.id_utilisateur) {
      this.errorMessage = '';
      this.successMessage = '';

      const { oldPassword, newPassword } = this.passwordForm.value;

      this.userService.updatePassword(
        this.user.id_utilisateur,
        oldPassword,
        newPassword
      ).subscribe({
        next: () => {
          this.successMessage = 'Mot de passe mis à jour avec succès';
          this.passwordForm.reset();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour du mot de passe';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }
}
