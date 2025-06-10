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
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-add-parent',
  templateUrl: './add-parent.component.html',
  styleUrls: ['./add-parent.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,
    BreadcrumbComponent
  ]
})
export class AddParentComponent {
  parentForm: FormGroup;
  errorMessage: string = '';

  breadscrums = [
    {
      title: 'Ajouter un parent',
      items: ['Accueil', 'Admin', 'Parents'],
      active: 'Ajouter un parent'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.parentForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.pattern('[a-zA-ZÀ-ÿ\\s\'-]+')]],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{8}$')
      ]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmationMotDePasse: ['', Validators.required],
      adresse: [''],
      cin: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]{8}$')
      ]],
      nomConjoint: [''],
      prenomConjoint: [''],
      telephoneConjoint: ['', Validators.pattern('^[0-9]{8}$')],
      situationParentale: ['', Validators.required]
    }, { validators: this.verifierMotsDePasse });
  }

  private verifierMotsDePasse(groupe: FormGroup) {
    const motDePasse = groupe.get('motDePasse')?.value;
    const confirmation = groupe.get('confirmationMotDePasse')?.value;
    return motDePasse === confirmation ? null : { nonIdentiques: true };
  }

  onSubmit(): void {
    if (this.parentForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement';
      return;
    }

    if (this.parentForm.hasError('nonIdentiques')) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    const formValues = this.parentForm.value;

    const parentData = {
      nom: formValues.nom,
      prenom: formValues.prenom,
      email: formValues.email,
      telephone: formValues.telephone,
      motDePasse: formValues.motDePasse,
      adresse: formValues.adresse,
      cin: formValues.cin,
      nomConjoint: formValues.nomConjoint,
      prenomConjoint: formValues.prenomConjoint,
      telephoneConjoint: formValues.telephoneConjoint,
      situationParentale: formValues.situationParentale,
      compteVerifie: true,
      role: 'Parent' // Le rôle est défini explicitement ici
    };

    this.http.post('http://localhost:8081/api/users', parentData).subscribe({
      next: () => {
        this.snackBar.open('Parent ajouté avec succès!', 'Fermer', {
          duration: 3000
        });
        this.parentForm.reset();
        this.errorMessage = '';
        this.router.navigate(['/admin/parents']);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du parent:", err);
        this.errorMessage = err.error?.message || err.message || "Erreur lors de l'ajout du parent";
        this.snackBar.open(this.errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/parents']);
  }
}
