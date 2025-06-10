import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Enfant } from '../all-students/students.model';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-enfant-dialog',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class EditEnfantDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEnfantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { enfant: Enfant }
  ) {
    this.editForm = this.fb.group({
      nom: [data.enfant.nom, Validators.required],
      prenom: [data.enfant.prenom, Validators.required],
      dateNaissance: [new Date(data.enfant.dateNaissance), Validators.required],
      classe: [data.enfant.niveau],
      sexe: [data.enfant.sexe, Validators.required]
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }
}
