import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChildDetailsDialogComponent } from './child-details-dialog.component';
import { EnfantService } from './students.service';
import { Enfant, Facture } from './students.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentDialogComponent } from './payment-dialog.component';
import { PaymentService } from '@core/service/payment.service';

@Component({
  selector: 'app-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class AllStudentsComponent {
  breadscrums = [{
    title: 'Mes Enfants',
    items: ['Dashboard', 'Parents'],
    active: 'Mes Enfants'
  }];

  enfants: Enfant[] = [];

  constructor(
    private enfantService: EnfantService,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEnfants();
  }

  loadEnfants(): void {
    this.enfantService.getMesEnfants().subscribe({
      next: (data) => this.enfants = data,
      error: (err) => this.showError('Erreur de chargement', err)
    });
  }

  showDetails(enfant: Enfant): void {
    this.dialog.open(ChildDetailsDialogComponent, {
      width: '700px',
      data: enfant
    });
  }

  openPaymentDialog(enfant: Enfant): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '500px',
      data: { enfant }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') this.loadEnfants();
    });
  }

  getStatutConfirmation(statut: string): string {
    const statusMap: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRME': 'Confirmé',
      'REFUSE': 'Refusé'
    };
    return statusMap[statut] || 'Inconnu';
  }

  getStatutPaiement(factures?: Facture[]): string {
    if (!factures || factures.length === 0) return 'Non facturé';
    const lastFacture = factures[factures.length - 1];
    return lastFacture.statutPaiement === 'PAYE' ? 'Payé' :
           lastFacture.statutPaiement === 'ECHEC' ? 'Échec' : 'En attente';
  }

  getChildAvatar(enfant: Enfant): string {
    return enfant.sexe === 'M'
      ? 'assets/images/garcon.jpg'
      : 'assets/images/fille.jpg';
  }

  private handleSuccess(message: string): void {
    this.loadEnfants();
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
