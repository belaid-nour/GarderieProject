import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AvertissementService } from '@core/service/avertissement.service';
import { AuthService } from '@core/service/auth.service';
import { ClasseService } from '@core/service/classe.service';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

interface Classe {
  id: number;
  nom: string;
}

interface Enfant {
  id: number;
  nom: string;
  prenom: string;
}

export enum Severite {
  LEGERE = 'LEGERE',
  MODEREE = 'MODEREE',
  GRAVE = 'GRAVE'
}

const SeveriteLabels: Record<Severite, string> = {
  [Severite.LEGERE]: 'Légère',
  [Severite.MODEREE]: 'Modérée',
  [Severite.GRAVE]: 'Grave',
};

@Component({
  selector: 'app-avertissement-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ],
  templateUrl: './avertissement.component.html',
  styleUrls: ['./avertissement.component.scss']
})
export class AvertissementFormComponent {
  @Output() avertissementCree = new EventEmitter<any>();

  form: FormGroup;
  classes: Classe[] = [];
  enfants: Enfant[] = [];
  severites = Object.values(Severite);
  SeveriteLabels = SeveriteLabels;

  errorMessage = '';
  isLoadingEnfants = false;
  isSubmitting = false;

  breadscrums = [
    {
      title: 'Ajouter un avertissement',
      items: ['Accueil', 'Dashboard', 'Avertissements'],
      active: 'Ajouter un avertissement'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private avertissementService: AvertissementService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      severite: [Severite.LEGERE, Validators.required],
      classeId: [null, Validators.required],
      enfantId: [null, Validators.required],
    });

    this.loadClasses();

    this.form.get('classeId')?.valueChanges.subscribe(id => {
      if (id) {
        this.loadEnfants(id);
        this.form.get('enfantId')?.setValue(null);
      } else {
        this.enfants = [];
        this.form.get('enfantId')?.setValue(null);
      }
    });
  }

  loadClasses() {
    this.classeService.getAllClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: () => this.showError('Erreur lors du chargement des classes')
    });
  }

  loadEnfants(classeId: number) {
    this.isLoadingEnfants = true;
    this.classeService.getEnfantsByClasseId(classeId).subscribe({
      next: (enfants) => {
        this.enfants = enfants;
        this.isLoadingEnfants = false;
      },
      error: () => {
        this.isLoadingEnfants = false;
        this.showError('Erreur lors du chargement des élèves');
      }
    });
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    this.isSubmitting = true;

    const dto = {
      titre: this.form.value.titre.trim(),
      description: this.form.value.description.trim(),
      severite: this.form.value.severite,
      enseignantId: currentUser.id_utilisateur,
      enfantId: this.form.value.enfantId
    };

    this.avertissementService.creerAvertissement(dto).subscribe({
      next: (avert) => {
        this.snackBar.open('Avertissement créé avec succès', 'Fermer', { duration: 3000 });
        this.avertissementCree.emit(avert);
        this.form.reset({
          titre: '',
          description: '',
          severite: Severite.LEGERE,
          classeId: null,
          enfantId: null
        });
        this.enfants = [];
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la création';
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.form.reset({
      titre: '',
      description: '',
      severite: Severite.LEGERE,
      classeId: null,
      enfantId: null
    });
    this.enfants = [];
    this.errorMessage = '';
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
