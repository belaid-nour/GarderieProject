import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

interface Enseignant {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  adresse?: string;
  role: string;
  cin?: string | null;
  telephone?: string | null;
  emailVerifie: boolean;
  compteVerifie: boolean;
}

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ]
})
export class AddTeacherComponent {
  proForm: FormGroup;
  errorMessage: string = '';

  breadscrums = [
    {
      title: 'Ajouter un professeur',
      items: ['Accueil', 'Admin', 'Professeurs'],
      active: 'Ajouter un professeur'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.proForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      nom: ['', Validators.required],
      adresse: [''],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmationMotDePasse: ['', Validators.required],
      cin: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ]],
      telephone: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]*$')
      ]]
    }, { validators: this.verifierMotsDePasse });
  }

  private verifierMotsDePasse(groupe: FormGroup) {
    const motDePasse = groupe.get('motDePasse')?.value;
    const confirmation = groupe.get('confirmationMotDePasse')?.value;
    return motDePasse === confirmation ? null : { nonIdentiques: true };
  }

  onSubmit(): void {
    if (this.proForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement';
      return;
    }

    if (this.proForm.hasError('nonIdentiques')) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    const formValues = this.proForm.value;

    const nouvelEnseignant: Enseignant = {
      nom: formValues.nom,
      prenom: formValues.prenom,
      email: formValues.email,
      motDePasse: formValues.motDePasse,
      adresse: formValues.adresse,
      role: 'Teacher',
      cin: formValues.cin,
      telephone: formValues.telephone,
      emailVerifie: true,
      compteVerifie: true
    };

    this.http.post('http://localhost:8081/api/users', nouvelEnseignant).subscribe({
      next: () => {
        this.snackBar.open('Professeur ajouté avec succès!', 'Fermer', {
          duration: 3000
        });
        this.proForm.reset();
        this.errorMessage = '';
        this.router.navigate(['/admin/teachers']);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du professeur:", err);
        this.errorMessage = err.error?.message || err.message || "Erreur lors de l'ajout du professeur";
        this.snackBar.open(this.errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/teachers']);
  }
}
