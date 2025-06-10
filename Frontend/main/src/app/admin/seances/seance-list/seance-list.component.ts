// all-parents.component.ts
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { SeanceService } from './seance.service';
import { Seance } from './seance.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TableExportUtil } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
   selector: 'app-seance-list',
  templateUrl: './seance-list.component.html',
  styleUrls: ['./seance-list.component.scss'],
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
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatRippleModule,
    BreadcrumbComponent,
  ]
})
export class SeanceListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'select',
    'nom',
    'horaire',
    'lieu',
    'startDate',
    'endDate',
    'recurrenceType',
    'classe',
    'actions'
  ];

  dataSource = new MatTableDataSource<Seance>([]);
  selection = new SelectionModel<Seance>(true, []);
  private destroy$ = new Subject<void>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private seanceService: SeanceService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading = true;
    this.seanceService.getAllSeances()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des séances', 'Fermer', { duration: 3000 });
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteOne(seance: Seance): void {
    if (confirm(`Voulez-vous supprimer "${seance.nom}" ?`)) {
      this.seanceService.deleteSeance(seance.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(s => s.id !== seance.id);
            this.snackBar.open('Séance supprimée', 'Fermer', { duration: 3000 });
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
          }
        });
    }
  }

  deleteSelected(): void {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Aucune séance sélectionnée', 'Fermer', { duration: 3000 });
      return;
    }

    if (confirm(`Supprimer ${this.selection.selected.length} séance(s) ?`)) {
      const deleteObservables = this.selection.selected.map(seance =>
        this.seanceService.deleteSeance(seance.id)
      );

      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            s => !this.selection.selected.some(selected => selected.id === s.id)
          );
          this.selection.clear();
          this.snackBar.open('Séances supprimées', 'Fermer', { duration: 3000 });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map(s => ({
      'Nom': s.nom,
      'Horaire': `${s.horaireDebut} - ${s.horaireFin}`,
      'Lieu': s.lieu,
      'Date début': s.startDate,
      'Date fin': s.endDate,
      'Récurrence': s.recurrenceType,
      'Classe': s.classe.nom
    }));

    TableExportUtil.exportToExcel(exportData, 'seances_export');
  }
}
