import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClasseService } from '../classe-list/classe.service';
import { Classe } from '../classe-list/classe.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-classe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-classe.component.html',
  styleUrls: ['./edit-classe.component.scss']
})
export class EditClasseComponent {
  classeForm!: FormGroup; // Correction avec l'opérateur de définitivité !
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditClasseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; classe?: Classe }
  ) {
    this.isEditMode = data.isEdit;
    this.initializeForm();
  }
  initializeForm() {
    this.classeForm = this.fb.group({
      nom: [this.data.classe?.nom || '', Validators.required],
      niveau: [this.data.classe?.niveau || '', Validators.required],
      annee: [this.data.classe?.annee || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, Validators.required],
      effectifMax: [this.data.classe?.effectifMax || 30, [Validators.required, Validators.min(1)]]
    });

    if (this.isEditMode) {
      this.classeForm.addControl('id', this.fb.control(this.data.classe?.id));
    }
  }

  onSubmit() {
    if (this.classeForm.invalid) return;

    const classeData: Classe = this.classeForm.value;

    const operation = this.isEditMode
      ? this.classeService.updateClasse(classeData.id!, classeData)
      : this.classeService.createClasse(classeData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(`Classe ${this.isEditMode ? 'modifiée' : 'créée'} avec succès`, 'Fermer', {
          duration: 3000
        });
        this.dialogRef.close('updated');
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
