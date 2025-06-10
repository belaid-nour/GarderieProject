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
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, takeUntil } from 'rxjs';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { TeachersService } from './teachers.service';
import { Teacher } from './teachers.model';
import { DatePipe, CommonModule, formatDate } from '@angular/common';
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
import { EditTeacherComponent } from '../edit-teacher/edit-teacher.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-teachers',
  templateUrl: './all-teachers.component.html',
  styleUrls: ['./all-teachers.component.scss'],
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
export class AllTeachersComponent implements OnInit, AfterViewInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id_utilisateur', label: 'ID', type: 'text', visible: true },
    { def: 'fullName', label: 'Nom complet', type: 'text', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'telephone', label: 'Téléphone', type: 'phone', visible: true },
    { def: 'adresse', label: 'Adresse', type: 'address', visible: true },
    { def: 'cin', label: 'CIN', type: 'text', visible: false },
    { def: 'situationParentale', label: 'Situation', type: 'text', visible: false },
    { def: 'compteVerifie', label: 'État', type: 'toggle', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true }
  ];

  dataSource = new MatTableDataSource<Teacher>([]);
  selection = new SelectionModel<Teacher>(true, []);
  isLoading = true;
  private destroy$ = new Subject<void>();
  contextMenuPosition = { x: '0px', y: '0px' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Tous les enseignants',
      items: ['Enseignants'],
      active: 'Tous les enseignants',
    },
  ];

  constructor(
    private teachersService: TeachersService,
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
    this.teachersService.getAllTeachers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Teacher[]) => {
          this.dataSource.data = data;
          this.isLoading = false;
          this.refreshTable();
        },
        error: (err: any) => {
          console.error(err);
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des données', 'Fermer', { duration: 3000 });
        }
      });
  }

  refresh() {
    this.isLoading = true;
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addNew() {
    this.router.navigate(['/admin/teachers/add-teacher']);
  }

  editCall(row: Teacher) {
    const dialogRef = this.dialog.open(EditTeacherComponent, {
      width: '60vw',
      maxWidth: '100vw',
      autoFocus: false,
      data: { teacherId: row.id_utilisateur }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.refresh();
      }
    });
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  deleteOne(row: Teacher): void {
    if (confirm(`Voulez-vous supprimer ${row.fullName} ?`)) {
      this.dataSource.data = this.dataSource.data.filter(item => item.id_utilisateur !== row.id_utilisateur);
      this.selection.deselect(row);
      this.refreshTable();
      this.snackBar.open(`${row.fullName} supprimé(e)`, 'Fermer', { duration: 3000 });
    }
  }

  deleteSelected(): void {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Aucun enseignant sélectionné', 'Fermer', { duration: 3000 });
      return;
    }

    if (confirm(`Supprimer ${this.selection.selected.length} enseignant(s) sélectionné(s) ?`)) {
      const idsToRemove = this.selection.selected.map(e => e.id_utilisateur);
      this.dataSource.data = this.dataSource.data.filter(item => !idsToRemove.includes(item.id_utilisateur));
      this.selection.clear();
      this.refreshTable();
      this.snackBar.open(`Enseignant(s) supprimé(s)`, 'Fermer', { duration: 3000 });
    }
  }

  toggleActivation(teacher: Teacher, actif: boolean): void {
    this.teachersService.toggleActivation(teacher.id_utilisateur, actif)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          teacher.compteVerifie = actif;
          this.snackBar.open(
            `Compte ${actif ? 'activé' : 'désactivé'} avec succès`,
            'Fermer',
            { duration: 3000 }
          );
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(
            'Erreur lors de la modification de l\'état du compte',
            'Fermer',
            { duration: 3000 }
          );
        }
      });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'ID': x.id_utilisateur,
      'Nom complet': x.fullName,
      'Email': x.email,
      'Téléphone': x.telephone,
      'Adresse': x.adresse,
      'CIN': x.cin,
      'Situation parentale': x.situationParentale,
      'État du compte': x.compteVerifie ? 'Activé' : 'Désactivé',
    }));

    TableExportUtil.exportToExcel(exportData, 'enseignants_export');
  }

  onContextMenu(event: MouseEvent, item: Teacher) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
