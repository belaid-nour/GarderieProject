import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeachersService } from '../all-teachers/teachers.service';

// Import des modules nécessaires
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
  ]
})
export class EditTeacherComponent implements OnInit {
  teacherForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private teachersService: TeachersService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditTeacherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teacherId: number }
  ) {
    this.teacherForm = this.createTeacherForm();
  }

  ngOnInit(): void {
    this.loadTeacherData();
  }

  loadTeacherData(): void {
    this.isLoading = true;
    this.teachersService.getTeacherById(this.data.teacherId).subscribe({
      next: (teacher) => {
        this.teacherForm.patchValue(teacher);
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Erreur lors du chargement des données', error);
      }
    });
  }

  createTeacherForm(): FormGroup {
    return this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      adresse: ['', Validators.required],
      cin: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      situationParentale: ['']
    });
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      this.isLoading = true;
      this.teachersService.updateTeacher(this.data.teacherId, this.teacherForm.value)
        .subscribe({
          next: () => {
            this.snackBar.open('✅ Professeur mis à jour avec succès', 'Fermer', { duration: 3000 });
            this.dialogRef.close('updated');
          },
          error: (error) => {
            this.handleError('Erreur lors de la mise à jour', error);
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private handleError(defaultMessage: string, error: any): void {
    console.error(error);
    const message = error.error?.message || error.message || defaultMessage;
    this.snackBar.open(`❌ ${message}`, 'Fermer', { duration: 5000 });
    this.isLoading = false;
  }
}
