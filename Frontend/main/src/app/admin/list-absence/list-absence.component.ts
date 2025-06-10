import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbsenceService } from '@core/service/absence.service';
import { Absence } from '@core/models/absence.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableExportUtil } from '@shared';

@Component({
  selector: 'app-absence-list',
  templateUrl: './list-absence.component.html',
  styleUrls: ['./list-absence.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class AbsencesAdminListComponent implements OnInit {
  absences: Absence[] = [];
  dataSource: MatTableDataSource<Absence>;
  displayedColumns: string[] = ['enfant', 'date', 'seance', 'raison', 'justifiee'];
  loading = false;
  errorMessage = '';
  classeId = 1;  // À remplacer par l'ID dynamique
  classeNom = 'Classe 1'; // À remplacer par le nom dynamique

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private absenceService: AbsenceService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Absence>(this.absences);
  }

  ngOnInit(): void {
    this.loadAbsences();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAbsences(): void {
    this.loading = true;
    this.errorMessage = '';
    this.absenceService.getAbsencesByClasse(this.classeId).subscribe({
      next: (data) => {
        this.absences = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des absences.";
        this.loading = false;
        console.error(err);
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refresh(): void {
    this.loadAbsences();
  }
}
