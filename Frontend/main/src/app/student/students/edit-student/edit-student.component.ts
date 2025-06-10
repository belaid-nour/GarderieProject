import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnfantService } from '../all-students/students.service';
import { Enfant } from '../all-students/students.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTooltipModule,
    BreadcrumbComponent
  ],
  templateUrl: './edit-student.component.html',
  providers: [DatePipe]
})
export class EditStudentComponent implements OnInit {
  enfantId!: number;
  isLoading = false;

  // Formulaires par étape
  basicInfoForm!: FormGroup;
  optionsForm!: FormGroup;
  authorizedPersonsForm!: FormGroup;

  showPersonneAutorisee1 = false;
  showPersonneAutorisee2 = false;
  currentTotal = 0;

  breadscrums = [
    {
      title: 'Modifier Étudiant',
      items: ['Étudiant'],
      active: 'Modifier Étudiant',
    },
  ];

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

  inscriptionTypes = [
    { value: 'annuelle', label: 'Annuelle (-5%)', coeff: 0.95, description: 'Paiement unique pour l\'année complète' },
    { value: 'semestre', label: 'Semestrielle (+5%)', coeff: 1.05, description: 'Deux paiements par an' },
    { value: 'trimestre', label: 'Trimestrielle (+10%)', coeff: 1.10, description: 'Quatre paiements par an' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private enfantService: EnfantService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.enfantId = +this.route.snapshot.paramMap.get('id')!;

    if (this.enfantId) {
      this.isLoading = true;
      this.enfantService.getEnfantById(this.enfantId).subscribe({
        next: (enfant) => {
          this.populateForm(enfant);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.snackBar.open('Erreur lors du chargement des données', 'Fermer', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  initializeForms(): void {
    this.basicInfoForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateNaissance: ['', [Validators.required, this.validateAge.bind(this)]],
      niveau: ['', Validators.required],
      sexe: ['', Validators.required],
      description: [''],
      rangDansFamille: [0, [Validators.min(0), Validators.max(20)]],
      nombreFrere: [0, [Validators.min(0), Validators.max(20)]],
      nombreSoeur: [0, [Validators.min(0), Validators.max(20)]],
      comportementEnfant: ['', [Validators.maxLength(500)]]
    });

    this.optionsForm = this.fb.group({
      bus: [false],
      club: [false],
      gouter: [false],
      tablier: [false],
      livre: [false],
      typeInscription: ['annuelle', Validators.required]
    });

    this.authorizedPersonsForm = this.fb.group({
      personneAutorisee1Nom: [''],
      personneAutorisee1Prenom: [''],
      personneAutorisee2Nom: [''],
      personneAutorisee2Prenom: ['']
    });

    this.optionsForm.valueChanges.subscribe(() => this.updateTotal());
  }

  populateForm(enfant: Enfant): void {
    // Informations de base
    this.basicInfoForm.patchValue({
      nom: enfant.nom,
      prenom: enfant.prenom,
      dateNaissance: this.datePipe.transform(enfant.dateNaissance, 'yyyy-MM-dd'),
      niveau: enfant.niveau,
      sexe: enfant.sexe,
      description: enfant.description,
      rangDansFamille: enfant.rangDansFamille,
      nombreFrere: enfant.nombreFrere,
      nombreSoeur: enfant.nombreSoeur,
      comportementEnfant: enfant.comportementEnfant
    });

    // Options
    this.optionsForm.patchValue({
      bus: enfant.bus,
      club: enfant.club,
      gouter: enfant.gouter,
      tablier: enfant.tablier,
      livre: enfant.livre,
      typeInscription: enfant.typeInscription
    });

    // Personnes autorisées
    this.authorizedPersonsForm.patchValue({
      personneAutorisee1Nom: enfant.personneAutorisee1Nom,
      personneAutorisee1Prenom: enfant.personneAutorisee1Prenom,
      personneAutorisee2Nom: enfant.personneAutorisee2Nom,
      personneAutorisee2Prenom: enfant.personneAutorisee2Prenom
    });

    // Afficher les sections des personnes autorisées
    this.showPersonneAutorisee1 = !!enfant.personneAutorisee1Nom || !!enfant.personneAutorisee1Prenom;
    this.showPersonneAutorisee2 = !!enfant.personneAutorisee2Nom || !!enfant.personneAutorisee2Prenom;

    this.updateTotal();
  }

  validateAge(control: any): { [key: string]: boolean } | null {
    if (control.value) {
      const birthDate = moment(control.value);
      const today = moment();
      const age = today.diff(birthDate, 'years');

      if (age < 3) {
        return { 'ageInvalide': true };
      }
    }
    return null;
  }

  maxBirthDate(): Date {
    const today = new Date();
    return new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
  }

  updateTotal(): void {
    this.currentTotal = this.calculateTotal().total;
  }

  calculateTotal(): { base: number, options: number, coeff: number, total: number } {
    let basePrice = 0;
    const selectedNiveau = this.basicInfoForm.value.niveau;

    if (selectedNiveau.includes("Jardin d'Enfants")) {
      basePrice = 1000;
    } else if (selectedNiveau === "Maternelle") {
      basePrice = 900;
    } else {
      basePrice = 800;
    }

    let optionsPrice = 0;
    if (this.optionsForm.value.bus) optionsPrice += 80;
    if (this.optionsForm.value.club) optionsPrice += 100;
    if (this.optionsForm.value.gouter) optionsPrice += 150;
    if (this.optionsForm.value.tablier) optionsPrice += 30;
    if (this.optionsForm.value.livre) optionsPrice += 120;

    const selectedType = this.inscriptionTypes.find(t => t.value === this.optionsForm.value.typeInscription);
    const coeff = selectedType?.coeff || 1;

    return {
      base: basePrice,
      options: optionsPrice,
      coeff: coeff,
      total: Math.round((basePrice + optionsPrice) * coeff)
    };
  }

  togglePersonneAutorisee(num: number): void {
    if (num === 1) {
      this.showPersonneAutorisee1 = !this.showPersonneAutorisee1;
      if (!this.showPersonneAutorisee1) {
        this.authorizedPersonsForm.patchValue({
          personneAutorisee1Nom: '',
          personneAutorisee1Prenom: ''
        });
      }
    } else {
      this.showPersonneAutorisee2 = !this.showPersonneAutorisee2;
      if (!this.showPersonneAutorisee2) {
        this.authorizedPersonsForm.patchValue({
          personneAutorisee2Nom: '',
          personneAutorisee2Prenom: ''
        });
      }
    }
  }

  onSubmit(): void {
    if (this.basicInfoForm.valid && this.optionsForm.valid) {
      this.isLoading = true;

      const formData = {
        ...this.basicInfoForm.value,
        ...this.optionsForm.value,
        ...this.authorizedPersonsForm.value,
        id: this.enfantId,
        statutConfirmation: 'CONFIRME'
      };

      this.enfantService.updateEnfant(this.enfantId, formData).subscribe({
        next: () => {
          this.snackBar.open('Étudiant mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/student/all-students']);
        },
        error: (err) => {
          console.error('Erreur de mise à jour', err);
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          this.isLoading = false;
        },
        complete: () => this.isLoading = false
      });
    }
  }
}
