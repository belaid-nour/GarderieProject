import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '@core/service/auth.service';
import { UserService } from '@core/service/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import Swal from 'sweetalert2'; // Import ajouté

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf,
    MatSelectModule,
    BreadcrumbComponent
  ]
})
export class EditProfilComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  private route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';

  breadscrums = [{
    title: 'Modification du profil',
    items: ['Profil'],
    active: 'Modification'
  }];

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.maxLength(50)]],
    prenom: ['', [Validators.required, Validators.maxLength(50)]],
    telephone: ['', [Validators.pattern(/^[0-9]{8}$/)]],
    cin: ['', [Validators.pattern(/^[0-9]{8}$/)]],
    adresse: [''],
    nomConjoint: [''],
    prenomConjoint: [''],
    telephoneConjoint: ['', [Validators.pattern(/^[0-9]{8}$/)]],
    situationParentale: ['']
  });


  userId = this.authService.currentUserValue?.id_utilisateur;

  ngOnInit() {
    if (this.userId) {
      this.loading = true;
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.form.patchValue(user);
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur de chargement des données';
          this.loading = false;
        }
      });
    }
  }



  onSubmit() {
    if (this.form.valid && this.userId) {
      this.loading = true;
      this.errorMessage = '';

      this.userService.updateUser(this.userId, this.form.value).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            title: 'Succès!',
            text: 'Profil mis à jour avec succès',
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/student/my-profil/mon-profil']);
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
          Swal.fire({
            title: 'Erreur!',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }
}


