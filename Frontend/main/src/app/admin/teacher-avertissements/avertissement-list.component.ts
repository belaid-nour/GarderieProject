import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvertissementService } from '@core/service/avertissement.service';
import { Avertissement } from '@core/models/avertissement.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  selector: 'app-evaluation-list',
  standalone: true,
  templateUrl: './avertissement-list.component.html',
  styleUrls: ['./avertissement-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
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
export class TeacherAvertissementsAdminComponent implements OnInit, AfterViewInit {
  avertissements: Avertissement[] = [];
  dataSource: MatTableDataSource<Avertissement>;
  displayedColumns: string[] = ['titre', 'description', 'severite', 'dateCreation', 'enfant', 'enseignant'];
  loading = false;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private avertissementService: AvertissementService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Avertissement>(this.avertissements);
  }

  ngOnInit(): void {
    this.loadAvertissements();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAvertissements(): void {
    this.loading = true;
    this.errorMessage = '';
    this.avertissementService.getAllAvertissements().subscribe({
      next: (data) => {
        this.avertissements = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des avertissements';
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
    this.loadAvertissements();
  }


  }



