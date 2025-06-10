import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParentsService } from '../all-parents/parents.service';

// Modules Angular Material
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
  selector: 'app-edit-parent',
  templateUrl: './edit-parent.component.html',
  styleUrls: ['./edit-parent.component.scss'],
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
export class EditParentComponent implements OnInit {
  parentForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private parentsService: ParentsService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditParentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parentId: number }
  ) {
    this.parentForm = this.createParentForm();
  }

  ngOnInit(): void {
    this.loadParentData();
  }

  loadParentData(): void {
    this.isLoading = true;
    this.parentsService.getParentById(this.data.parentId).subscribe({
      next: (parent) => {
        this.parentForm.patchValue(parent);
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Erreur lors du chargement des données', error);
      }
    });
  }

  createParentForm(): FormGroup {
    return this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      adresse: [''],
      cin: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      nomConjoint: [''],
      prenomConjoint: [''],
      telephoneConjoint: ['', [Validators.pattern('[0-9]{8}')]],
      situationParentale: ['']
    });
  }

  onSubmit(): void {
    if (this.parentForm.valid) {
      this.isLoading = true;
      this.parentsService.updateParent(this.data.parentId, this.parentForm.value)
        .subscribe({
          next: () => {
            this.snackBar.open('✅ Parent mis à jour avec succès', 'Fermer', { duration: 3000 });
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
