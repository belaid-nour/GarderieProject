import { Component, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { EnfantService } from './students.service';
import { Enfant } from './students.model';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRippleModule } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TableExportUtil } from '@shared';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditEnfantDialogComponent } from '../edit-student/edit-student.component';

@Component({
  selector: 'app-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatRippleModule,
    MatDialogModule,
    MatSnackBarModule,
    BreadcrumbComponent,
  ]
})
export class AllStudentsComponent implements AfterViewInit, OnDestroy {
  columnDefinitions = [
    { def: 'id', label: 'ID', visible: true },
    { def: 'nom', label: 'Nom', visible: true },
    { def: 'prenom', label: 'Prénom', visible: true },
    { def: 'dateNaissance', label: 'Date Naissance', visible: true },
    { def: 'classe', label: 'Classe', visible: true },
    { def: 'statut', label: 'Statut', visible: true },
    { def: 'paye', label: 'Paiement', visible: true },
    { def: 'parent', label: 'Parent', visible: true },
    { def: 'actions', label: 'Actions', visible: true }
  ];

  dataSource = new MatTableDataSource<Enfant>([]);
  isLoading = true;
  private destroy$ = new Subject<void>();
  selectedEnfant!: Enfant;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('detailsDialog') detailsDialog!: TemplateRef<any>;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  // Statistiques
  get totalCount(): number {
    return this.dataSource.data.length;
  }

  get confirmedCount(): number {
    return this.dataSource.data.filter(e => e.confirmed).length;
  }

  get totalPaid(): number {
    return this.dataSource.data.filter(e => e.paye).length;
  }

  get totalUnpaid(): number {
    return this.dataSource.data.filter(e => !e.paye).length;
  }

  breadscrums = [
    {
      title: 'Tous les enfants',
      items: ['Enfants'],
      active: 'Liste des enfants',
    },
  ];

  constructor(
    private enfantService: EnfantService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.loadData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.enfantService.getAllEnfants()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.showError('Erreur de chargement');
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  toggleConfirmation(enfant: Enfant): void {
    if (enfant.confirmed) {
      this.disconfirmEnfant(enfant);
    } else {
      this.confirmEnfant(enfant);
    }
  }


  confirmEnfant(enfant: Enfant): void {
    this.enfantService.confirmEnfant(enfant.id).subscribe({
      next: (updated) => {
        enfant.confirmed = updated.confirmed;
        this.showSuccess('Enfant confirmé avec succès');
        this.dataSource._updateChangeSubscription();
      },
      error: () => this.showError('Échec de la confirmation')
    });
  }

  disconfirmEnfant(enfant: Enfant): void {
    this.enfantService.disconfirmEnfant(enfant.id).subscribe({
      next: (updated) => {
        enfant.confirmed = updated.confirmed;
        this.showSuccess('Confirmation annulée avec succès');
        this.dataSource._updateChangeSubscription();
      },
      error: () => this.showError('Échec de l\'annulation')
    });
  }



  viewDetails(enfant: Enfant): void {
    this.selectedEnfant = enfant;
    this.dialog.open(this.detailsDialog, {
      width: '800px',
      panelClass: 'custom-dialog-container'
    });
  }

  refresh() {
    this.isLoading = true;
    this.loadData();
  }

  exportExcel() {
    const headers = ['ID', 'Nom', 'Prénom', 'Date naissance', 'Classe', 'Statut', 'Paiement', 'Parent'];
    const exportData = this.dataSource.filteredData.map(x => [
      x.id,
      x.nom,
      x.prenom,
      new Date(x.dateNaissance).toLocaleDateString(),
      x.niveau,
      x.confirmed ? 'Confirmé' : 'En attente',
      x.paye ? 'Payé' : 'Non Payé',
      `${x.user?.nom} ${x.user?.prenom}`
    ]);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }
  editEnfant(enfant: Enfant): void {
    const dialogRef = this.dialog.open( EditEnfantDialogComponent, {
      width: '600px',
      data: { enfant: { ...enfant } }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.enfantService.updateEnfant(enfant.id, updated).subscribe({
          next: (res) => {
            Object.assign(enfant, res);
            this.dataSource._updateChangeSubscription();
            this.showSuccess('Enfant modifié avec succès');
          },
          error: () => this.showError('Échec de la modification')
        });
      }
    });
  }
  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top'
    });
  }
}
