import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClasseService } from '../classe-list/classe.service';
import { Classe } from '../classe-list/classe.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-classe-form',
  standalone: true,
  templateUrl: './classe-form.component.html',
  styleUrls: ['./classe-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
    BreadcrumbComponent
  ]
})
export class ClasseFormComponent implements OnInit {
 classeForm!: FormGroup; // Ajout de l'opérateur de définiteness assertion
  isEditMode = false;
  currentClasseId = 0;
  niveauxOptions = [
    "Jardin d'Enfants 1",
    "Jardin d'Enfants 2",
    "Maternelle",
    "1ère année primaire",
    "2ème année primaire",
    "3ème année primaire",
    "4ème année primaire",
    "5ème année primaire",
    "6ème année primaire"
  ];

  anneesOptions = ['2023-2024', '2024-2025'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private classeService: ClasseService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.classeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      niveau: [this.niveauxOptions[0], Validators.required],
      annee: [this.anneesOptions[0], Validators.required],
      effectifMax: ['', [Validators.required, Validators.min(1)]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.currentClasseId = +id;
      this.loadClasseData();
    }
  }

  private loadClasseData(): void {
    this.classeService.getClasseById(this.currentClasseId).subscribe({
      next: (classe) => this.classeForm.patchValue(classe),
      error: (err) => this.showErrorAlert('Erreur de chargement', err.message)
    });
  }

  onSubmit(): void {
    if (this.classeForm.invalid) return;

    const classeData: Classe = this.classeForm.value;
    const operation = this.isEditMode
      ? this.classeService.updateClasse(this.currentClasseId, classeData)
      : this.classeService.createClasse(classeData);

    operation.subscribe({
      next: () => {
        this.showSuccessAlert();
        this.router.navigate(['/admin/classe/list-class']);
      },
      error: (err) => this.showErrorAlert('Erreur', err.error?.message || err.message)
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/classe/list-class']);
  }

  private showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: `Classe ${this.isEditMode ? 'modifiée' : 'créée'} avec succès`,
      timer: 3000,
      showConfirmButton: false
    });
  }

  private showErrorAlert(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });
  }

  // Getters pour accès facile aux contrôles
  get nom() { return this.classeForm.get('nom'); }
  get niveau() { return this.classeForm.get('niveau'); }
  get annee() { return this.classeForm.get('annee'); }
  get effectifMax() { return this.classeForm.get('effectifMax'); }
}
