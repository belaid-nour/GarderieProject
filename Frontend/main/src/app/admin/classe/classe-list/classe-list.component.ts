import {
  Component,

  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Classe } from './classe.model';
import { EditClasseComponent } from '../classe-form-edit/edit-classe.component';

import { TableExportUtil } from '@shared';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClasseService } from '../classe-list/classe.service';

import { Subject, takeUntil, forkJoin } from 'rxjs';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-classe-list',
  templateUrl: './classe-list.component.html',
  styleUrls: ['./classe-list.component.scss'],
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
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatMenuModule
    ,
    MatSlideToggleModule,
    MatRippleModule,
    BreadcrumbComponent,
  ]
})

export class ClasseListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'nom',
    'niveau',
    'annee',
    'effectifMax',
    'effectifActuel',
    'actions'
  ];
  dataSource = new MatTableDataSource<Classe>();
  searchKey = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  breadscrums = [
    {
      title: 'Gestion des Classes',
      items: ['Scolarité'],
      active: 'Liste des Classes'
    }
  ];

  constructor(
    private classeService: ClasseService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadClasses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClasses() {
    this.classeService.getAllClasses().subscribe({
      next: (data) => {
        this.dataSource.data = data.map(classe => ({
          ...classe,
          effectifActuel: classe.enfants?.length || 0
        }));
      },
      error: (err) => this.showErrorAlert('Erreur de chargement des classes')
    });
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditClasseComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') this.loadClasses();
    });
  }

  openEditDialog(classe: Classe) {
    this.classeService.getClasseById(classe.id).subscribe({
      next: (classeComplete) => {
        const dialogRef = this.dialog.open(EditClasseComponent, {
          width: '600px',
          data: { isEdit: true, classe: classeComplete }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'updated') this.loadClasses();
        });
      },
      error: (err) => this.showErrorAlert('Erreur de chargement des données')
    });
  }

  deleteClasse(classe: Classe) {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Voulez-vous vraiment supprimer la classe ${classe.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.classeService.deleteClasse(classe.id).subscribe({
          next: () => {
            this.loadClasses();
            this.showSuccessAlert('Classe supprimée avec succès');
          },
          error: (err) => this.showErrorAlert('Erreur de suppression')
        });
      }
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map(classe => ({
      Nom: classe.nom,
      Niveau: classe.niveau,
      Année: classe.annee,
      'Effectif Max': classe.effectifMax,
      'Effectif Actuel': classe.enfants?.length || 0
    }));

    TableExportUtil.exportToExcel(exportData, 'classes_export');
  }

  private showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: message,
      timer: 3000,
      showConfirmButton: false
    });
  }

  private showErrorAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      confirmButtonColor: '#3085d6'
    });
  }
}
