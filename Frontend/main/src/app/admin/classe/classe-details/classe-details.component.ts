import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // Added MatTableDataSource import
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClasseService } from '../classe-list/classe.service';
import { EnfantService } from '../classe-list/students.service';
import { Classe } from '../classe-list/classe.model';
import { Enfant } from '../classe-list/students.model';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TableExportUtil } from '@shared';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-classe-assign',
  templateUrl: './classe-details.component.html',
  styleUrls: ['./classe-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
    MatFormFieldModule,
    BreadcrumbComponent
  ]
})
export class ClasseAssignComponent implements OnInit {
  displayedColumns = ['sexe', 'nom', 'prenom', 'age', 'niveau', 'classe', 'actions'];
  dataSource = new MatTableDataSource<Enfant>(); // Using MatTableDataSource here
  classes: Classe[] = [];
  selectedClasse: { [key: number]: number } = {};
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  breadscrums = [{
    title: 'Assignation des classes',
    items: ['Élèves', 'Classes'],
    active: 'Assignation'
  }];

  constructor(
    private classeService: ClasseService,
    private enfantService: EnfantService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.classeService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.loadEnfantsNonAssignes();
      },
      error: (err) => this.handleError(err)
    });
  }

  private loadEnfantsNonAssignes(): void {
    this.enfantService.getAllEnfants().subscribe({
      next: (enfants) => {
        this.dataSource.data = enfants
          .filter(e => !e.classeId)
          .map(e => ({
            ...e,
            age: this.calculateAge(e.dateNaissance)
          }));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  private calculateAge(dateNaissance: Date): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  classesFiltrees(niveau: string): Classe[] {
    return this.classes.filter(c => c.niveau === niveau);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async assignerEnfant(enfantId: number): Promise<void> {
    const classeId = this.selectedClasse[enfantId];
    if (!classeId) return;

    try {
      await this.classeService.assignerEnfant(classeId, enfantId).toPromise();
      this.dataSource.data = this.dataSource.data.filter(e => e.id !== enfantId);
      delete this.selectedClasse[enfantId];

      await Swal.fire({
        icon: 'success',
        title: 'Assignation réussie',
        text: `L'élève a été assigné à la classe avec succès`,
        timer: 3000,
        showConfirmButton: false
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  exportExcel(): void {
    const exportData = this.dataSource.filteredData.map(e => ({
      'Sexe': e.sexe === 'M' ? 'Masculin' : 'Féminin',
      'Nom': e.nom,
      'Prénom': e.prenom,
      'Âge': e.age,
      'Niveau': e.niveau,
      'Classe assignée': this.classes.find(c => c.id === this.selectedClasse[e.id])?.nom || 'Non assigné'
    }));
    TableExportUtil.exportToExcel(exportData, 'assignation_classes');
  }

  private handleError(error: any): void {
    console.error(error);
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors du chargement des données',
      timer: 3000
    });
  }
}
