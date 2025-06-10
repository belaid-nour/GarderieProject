import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeanceService } from '../seance-list/seance.service';
import { ClasseService } from '../seance-list/classe.service';
import { UserService } from '../seance-list/user.service';
import { Seance, Classe, Enseignant } from '../seance-list/seance.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seance-form',
  standalone: true,
  templateUrl: './seance-form.component.html',
  styleUrls: ['./seance-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
        BreadcrumbComponent

  ]
})
export class SeanceFormComponent implements OnInit {
  seanceForm: FormGroup;
  isEditMode = false;
  currentSeanceId?: number;
  classes: Classe[] = [];
  enseignants: Enseignant[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private seanceService: SeanceService,
    private classeService: ClasseService,
    private userService: UserService
  ) {
    this.seanceForm = this.fb.group({
      nom: ['', Validators.required],
      horaireDebut: ['', Validators.required],
      horaireFin: ['', Validators.required],
      obligatoire: [false],
      lieu: ['', Validators.required],
      recurrenceType: ['AUCUNE', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      classeId: ['', Validators.required],
      enseignantId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.currentSeanceId = +id;
      this.loadSeanceData(id);
    }
  }

  private loadInitialData(): void {
    this.isLoading = true;

    this.classeService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.userService.getTeachers().subscribe({
          next: (enseignants) => {
            this.enseignants = enseignants;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading teachers:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading classes:', err);
        this.isLoading = false;
      }
    });
  }

  private loadSeanceData(id: number): void {
    this.seanceService.getSeance(id).subscribe({
      next: (seance) => {
        this.seanceForm.patchValue({
          ...seance,
          recurrenceType: seance.recurrenceType,
          startDate: seance.startDate,
          endDate: seance.endDate,
          classeId: seance.classe.id,
          enseignantId: seance.enseignant.id_utilisateur
        });
      },
      error: (err) => console.error('Error loading seance:', err)
    });
  }

  onSubmit(): void {
    if (this.seanceForm.valid && !this.isLoading) {
      const formValue = this.seanceForm.value;
      const seanceData: Seance = {
        ...formValue,
        recurrenceType: formValue.recurrenceType,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        classe: { id: formValue.classeId },
        enseignant: { id_utilisateur: formValue.enseignantId }
      };

      this.isLoading = true;

      const operation = this.isEditMode && this.currentSeanceId ?
        this.seanceService.updateSeance(this.currentSeanceId, seanceData) :
        this.seanceService.createSeance(seanceData, formValue.classeId, formValue.enseignantId);

      operation.subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/seances/all-seances']);
        },
        error: (err) => {
          console.error('Error saving seance:', err);
          this.isLoading = false;
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      });
    }
  }
}
