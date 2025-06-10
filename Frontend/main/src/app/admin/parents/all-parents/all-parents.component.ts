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
import { ParentsService } from './parents.service';
import { Parent } from './parent.model';
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
import { EditParentComponent } from '../edit-parent/edit-parent.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TableExportUtil } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-parents',
  templateUrl: './all-parents.component.html',
  styleUrls: ['./all-parents.component.scss'],
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
export class AllParentsComponent implements OnInit, AfterViewInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id_utilisateur', label: 'ID', type: 'text', visible: true },
    { def: 'fullName', label: 'Nom complet', type: 'text', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'telephone', label: 'Téléphone', type: 'phone', visible: true },
    { def: 'adresse', label: 'Adresse', type: 'address', visible: true },
    { def: 'cin', label: 'CIN', type: 'text', visible: false },
    { def: 'nomConjoint', label: 'Nom conjoint', type: 'text', visible: false },
    { def: 'prenomConjoint', label: 'Prénom conjoint', type: 'text', visible: false },
    { def: 'telephoneConjoint', label: 'Tel. conjoint', type: 'phone', visible: false },
    { def: 'situationParentale', label: 'Situation parentale', type: 'text', visible: false },
    { def: 'compteVerifie', label: 'État', type: 'toggle', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true }
  ];

  dataSource = new MatTableDataSource<Parent>([]);
  selection = new SelectionModel<Parent>(true, []);
  isLoading = true;
  private destroy$ = new Subject<void>();
  contextMenuPosition = { x: '0px', y: '0px' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Tous les parents',
      items: ['Parents'],
      active: 'Liste des parents',
    },
  ];

  constructor(
    private parentsService: ParentsService,
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
    this.parentsService.getAllParents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Parent[]) => {
          this.dataSource.data = data;
          this.isLoading = false;
          this.refreshTable();
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des parents', 'Fermer', { duration: 3000 });
        }
      });
  }

  refresh() {
    this.isLoading = true;
    this.loadData();
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

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  addNew() {
    this.router.navigate(['/admin/parents/add-parent']);
  }

  editCall(row: Parent) {
    const dialogRef = this.dialog.open(EditParentComponent, {
      width: '60vw',
      maxWidth: '100vw',
      autoFocus: false,
      data: { parentId: row.id_utilisateur }
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

  deleteOne(row: Parent): void {
    if (confirm(`Voulez-vous supprimer ${row.fullName} ?`)) {
      this.parentsService.deleteParent(row.id_utilisateur)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(item => item.id_utilisateur !== row.id_utilisateur);
            this.selection.deselect(row);
            this.refreshTable();
            this.snackBar.open(`${row.fullName} supprimé(e)`, 'Fermer', { duration: 3000 });
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
      this.snackBar.open('Aucun parent sélectionné', 'Fermer', { duration: 3000 });
      return;
    }

    if (confirm(`Supprimer ${this.selection.selected.length} parent(s) sélectionné(s) ?`)) {
      const deleteObservables = this.selection.selected.map(parent =>
        this.parentsService.deleteParent(parent.id_utilisateur)
      );

      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            item => !this.selection.selected.some(selected => selected.id_utilisateur === item.id_utilisateur)
          );
          this.selection.clear();
          this.refreshTable();
          this.snackBar.open(`Parent(s) supprimé(s)`, 'Fermer', { duration: 3000 });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  toggleActivation(parent: Parent, actif: boolean): void {
    this.parentsService.toggleActivation(parent.id_utilisateur, actif)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          parent.compteVerifie = actif;
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
          parent.compteVerifie = !actif;
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
      'Nom conjoint': x.nomConjoint,
      'Prénom conjoint': x.prenomConjoint,
      'Tel. conjoint': x.telephoneConjoint,
      'Situation parentale': x.situationParentale,
      'État du compte': x.compteVerifie ? 'Activé' : 'Désactivé',
    }));

    TableExportUtil.exportToExcel(exportData, 'parents_export');
  }

  onContextMenu(event: MouseEvent, item: Parent) {
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
