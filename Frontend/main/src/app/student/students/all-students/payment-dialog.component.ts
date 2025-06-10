import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '@core/service/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import ajouté

@Component({
  selector: 'app-payment-dialog',
  template: `
    <h2 mat-dialog-title class="payment-title">
      <mat-icon class="me-2">euro_symbol</mat-icon>
      Paiement pour {{ data.enfant.prenom }} {{ data.enfant.nom }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="paymentForm" class="payment-form">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Montant (€)</mat-label>
          <input
            matInput
            type="number"
            formControlName="amount"
            step="0.01"
            placeholder="Entrez le montant"
          >
          <mat-error *ngIf="paymentForm.get('amount')?.hasError('required')">
            Montant obligatoire
          </mat-error>
          <mat-error *ngIf="paymentForm.get('amount')?.hasError('min')">
            Minimum 1€ requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Description du paiement</mat-label>
          <textarea
            matInput
            formControlName="description"
            rows="3"
            placeholder="Ex: Paiement inscription scolaire"
          ></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="payment-actions">
      <button mat-stroked-button mat-dialog-close color="warn">
        <mat-icon>close</mat-icon> Annuler
      </button>

      <button
        mat-raised-button
        color="primary"
        (click)="submitPayment()"
        [disabled]="paymentForm.invalid || loading"
      >
        <span *ngIf="!loading">Confirmer le paiement</span>
        <mat-spinner *ngIf="loading" diameter="24"></mat-spinner>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .payment-title {
      display: flex;
      align-items: center;
      color: #3f51b5;
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
      margin: 0 -24px;
      padding: 0 24px 16px;
    }

    .payment-form {
      min-width: 400px;

      mat-form-field {
        margin-bottom: 1.5rem;

        textarea {
          resize: vertical;
          min-height: 80px;
        }
      }
    }

    .payment-actions {
      padding: 16px 0 0;
      border-top: 1px solid #eee;
      margin: 0 -24px;
      padding: 16px 24px 0;

      button {
        margin-left: 8px;

        mat-icon {
          margin-right: 4px;
          font-size: 18px;
          height: 18px;
          width: 18px;
        }
      }
    }

    .mat-mdc-progress-spinner {
      margin: 0 8px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule, // Ajouté
    MatIconModule // Ajouté
  ]
})
export class PaymentDialogComponent {
  paymentForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { enfant: any }
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  submitPayment() {
    if (this.paymentForm.invalid) return;

    this.loading = true;
    this.paymentService.initiatePayment(
      this.data.enfant.id,
      this.paymentForm.value
    ).subscribe({
      next: (response) => {
        this.dialogRef.close('success');
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          err.error?.message || 'Erreur lors du paiement',
          'Fermer',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }
}
