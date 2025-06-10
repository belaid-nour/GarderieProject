import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnfantService } from '../all-students/students.service';
import { Router } from '@angular/router';
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
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-add-student',
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
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {
  breadscrums = [
    {
      title: 'Ajouter un élève',
      items: ['Accueil', 'Admin', 'Élèves'],
      active: 'Ajouter un élève'
    }
  ];

  basicInfoForm!: FormGroup;
  optionsForm!: FormGroup;
  authorizedPersonsForm!: FormGroup;

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

  showPersonneAutorisee1 = false;
  showPersonneAutorisee2 = false;
  currentTotal = 0;

  constructor(
    private fb: FormBuilder,
    private enfantService: EnfantService,
    private router: Router
  ) {
    this.initializeForms();
  }

  initializeForms(): void {
    this.basicInfoForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateNaissance: ['', [Validators.required, this.validateAge.bind(this)]],
      niveau: ['', Validators.required], // Changé de 'classe' à 'niveau'
      sexe: ['', Validators.required],
      description: [''],
      rangDansFamille: [0, [Validators.min(0), Validators.max(20)]],
      nombreFrere: [0, [Validators.min(0), Validators.max(20)]],
      nombreSoeur: [0, [Validators.min(0), Validators.max(20)]]
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

  async onSubmit(): Promise<void> {
    if (this.basicInfoForm.valid && this.optionsForm.valid) {
      const total = this.calculateTotal();

      const personnesAut = [];
      if (this.showPersonneAutorisee1) {
        personnesAut.push({
          nom: this.authorizedPersonsForm.value.personneAutorisee1Nom,
          prenom: this.authorizedPersonsForm.value.personneAutorisee1Prenom
        });
      }
      if (this.showPersonneAutorisee2) {
        personnesAut.push({
          nom: this.authorizedPersonsForm.value.personneAutorisee2Nom,
          prenom: this.authorizedPersonsForm.value.personneAutorisee2Prenom
        });
      }

      const result = await Swal.fire({
        title: 'Confirmation finale',
        html: `
          <div class="text-left">
            <p><b>Type d'inscription:</b> ${this.optionsForm.value.typeInscription.toUpperCase()}</p>
            <p><b>Coût total:</b> ${total.total} DT (Détail: ${total.base} + ${total.options} x ${total.coeff})</p>
            <p class="mt-3">Voulez-vous confirmer cette inscription?</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Modifier',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      });

      if (result.isConfirmed) {
        const formData = {
          ...this.basicInfoForm.value,
          ...this.optionsForm.value,
          personnesAutorisees: personnesAut,
          confirmed: true,
          paye: false,
          dateInscription: new Date(),
          total: total.total,
          classe_id: this.getClasseIdFromNiveau(this.basicInfoForm.value.niveau)
        };

        const birthDate = moment(formData.dateNaissance);
        const today = moment();
        formData.age = today.diff(birthDate, 'years');

        this.enfantService.addEnfant(formData).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès!',
              text: 'L\'élève a été inscrit avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/student/students/edit-students']);
            });
          },
          error: (err) => {
            console.error('Erreur:', err);
            Swal.fire(
              'Erreur',
              'Une erreur est survenue lors de l\'enregistrement.',
              'error'
            );
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.basicInfoForm);
      this.markFormGroupTouched(this.optionsForm);
      Swal.fire({
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir correctement tous les champs obligatoires.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  private getClasseIdFromNiveau(niveau: string): number {
    // Implémentez cette méthode selon votre logique métier
    const niveauxMap: {[key: string]: number} = {
      "Jardin d'Enfants 1": 1,
      "Jardin d'Enfants 2": 2,
      "Maternelle": 3,
      "1ère année primaire": 4,
      "2ème année primaire": 5,
      "3ème année primaire": 6,
      "4ème année primaire": 7,
      "5ème année primaire": 8,
      "6ème année primaire": 9
    };
    return niveauxMap[niveau] || 0;
  }

  maxBirthDate(): Date {
    const today = new Date();
    return new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
