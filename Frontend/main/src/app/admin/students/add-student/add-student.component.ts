import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TableExportUtil } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { EnfantService } from '../all-students/students.service';
import { Enfant } from '../all-students/students.model';
import { MatRadioModule } from '@angular/material/radio';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-all-parents',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
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
    MatRippleModule,
    BreadcrumbComponent,
  ]
})
export class AddStudentComponent implements OnInit, AfterViewInit, OnDestroy {
  columnDefinitions = [
    { def: 'fullName', label: '🧍‍♂️ Nom complet', type: 'text', visible: true },
    { def: 'email', label: '📧 Email', type: 'email', visible: true },
    { def: 'telephone', label: '📞 Téléphone', type: 'phone', visible: true },
    { def: 'cin', label: '🆔 CIN', type: 'text', visible: true },
    { def: 'compteVerifie', label: '✅ État', type: 'text', visible: true },
    { def: 'actions', label: '⚙️ Actions', type: 'action', visible: true }
  ];

  dataSource = new MatTableDataSource<Parent>([]);
  isLoading = true;
  private destroy$ = new Subject<void>();
  selectedParent: Parent | null = null;

  newChild = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    niveau: '',
    sexe: 'M',
    bus: false,
    club: false,
    gouter: false,
    tablier: false,
    livre: false,
    rangDansFamille: 1,
    nombreFrere: 0,
    nombreSoeur: 0,
    description: '',
    allergies: '',
    maladiesChroniques: ''
  };

  niveaux = [
    "Jardin d'Enfants 1",
    "Jardin d'Enfants 2",
    "Maternelle",
    "1ère année primaire",
    "2ème année primaire",
    "3ème année primaire",
    "4ème année primaire",
    "5ème année primaire",
    "6ème année primaire"
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

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
    private enfantService: EnfantService
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

  private refreshTable() {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  selectParent(parent: Parent): void {
    this.selectedParent = parent;
  }

  cancelAddChild(): void {
    this.selectedParent = null;
    this.resetChildForm();
  }

  addChild(): void {
    if (!this.selectedParent) {
      this.showError('Aucun parent sélectionné');
      return;
    }

    if (!this.validateChildForm()) return;

    const childData = this.prepareChildData();
    const parentId = this.selectedParent.id_utilisateur;

    this.isLoading = true;
    this.enfantService.addEnfantAdmin(childData, parentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
        complete: () => this.isLoading = false
      });
  }

  private prepareChildData(): any {
    return {
      ...this.newChild,
      dateNaissance: formatDate(new Date(this.newChild.dateNaissance), 'yyyy-MM-dd', 'en'),
      user: { id: this.selectedParent!.id_utilisateur },
      description: this.buildDescription(),
      confirmed: false,
      paye: false
    };
  }

  private buildDescription(): string {
    return [
      `Allergies: ${this.newChild.allergies || 'Aucune'}`,
      `Maladies chroniques: ${this.newChild.maladiesChroniques || 'Aucune'}`
    ].join('\n');
  }

  private validateChildForm(): boolean {
    const requiredFields = [
      { field: this.newChild.nom, name: 'Nom' },
      { field: this.newChild.prenom, name: 'Prénom' },
      { field: this.newChild.dateNaissance, name: 'Date de naissance' },
      { field: this.newChild.niveau, name: 'niveau' },
      { field: this.newChild.sexe, name: 'Sexe' }
    ];

    const missingField = requiredFields.find(f => !f.field?.toString().trim());
    if (missingField) {
      this.showError(`${missingField.name} est requis`);
      return false;
    }

    if (isNaN(Date.parse(this.newChild.dateNaissance))) {
      this.showError('Date de naissance invalide');
      return false;
    }

    return true;
  }

  private resetChildForm(): void {
    this.newChild = {
      nom: '',
      prenom: '',
      dateNaissance: '',
      niveau: '',
      sexe: 'M',
      bus: false,
      club: false,
      gouter: false,
      tablier: false,
      livre: false,
      rangDansFamille: 1,
      nombreFrere: 0,
      nombreSoeur: 0,
      description: '',
      allergies: '',
      maladiesChroniques: ''
    };
  }

  private handleSuccess(): void {
    this.snackBar.open('Enfant ajouté avec succès', 'Fermer', { duration: 3000 });
    this.cancelAddChild();
    this.refreshParentData();
  }

  private handleError(err: any): void {
    console.error('Erreur:', err);
    const errorMessage = err.error?.message || 'Erreur lors de l\'ajout de l\'enfant';
    this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
  }

  private refreshParentData(): void {
    this.parentsService.getAllParents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.dataSource.data = data);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'Nom complet': x.fullName,
      'Email': x.email,
      'Téléphone': x.telephone,
      'CIN': x.cin,
      'État du compte': x.compteVerifie ? 'Activé' : 'Désactivé'
    }));

    TableExportUtil.exportToExcel(exportData, 'parents_export');
  }
}
