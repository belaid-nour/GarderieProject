import { Component, OnInit } from '@angular/core';
import { ClasseService } from '../classe-list/classe.service';
import { Classe } from '../classe-list/classe.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-classe-list-enfant',
  templateUrl: './classe-list-enfant.component.html',
  styleUrls: ['./classe-list-enfant.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressBarModule,
    BreadcrumbComponent
  ]
})
export class ClasseListEnfantComponent implements OnInit {
  classes: Classe[] = [];
  filteredClasses: { [key: string]: Classe[] } = {};
  niveaux: string[] = [];
  niveauxFiltres: string[] = [];
  selectedNiveau: string = '';
  isLoading = true;

  constructor(private classeService: ClasseService) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  private loadClasses(): void {
    this.classeService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.niveaux = this.getUniqueNiveaux(classes);
        this.updateFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }

  private getUniqueNiveaux(classes: Classe[]): string[] {
    return [...new Set(classes.map(classe => classe.niveau.trim()))].filter(n => !!n);
  }

  private updateFilters(): void {
    this.filteredClasses = this.groupClasses();
    this.niveauxFiltres = this.selectedNiveau ? [this.selectedNiveau] : this.niveaux;
  }

  private groupClasses(): { [key: string]: Classe[] } {
    return this.classes.reduce((acc, classe) => {
      if (this.shouldIncludeClass(classe)) {
        const niveau = classe.niveau.trim(); // Supprimer .toLowerCase()
        acc[niveau] = acc[niveau] || [];
        acc[niveau].push(classe);
      }
      return acc;
    }, {} as { [key: string]: Classe[] });
  }

  private shouldIncludeClass(classe: Classe): boolean {
    return !this.selectedNiveau || classe.niveau.trim() === this.selectedNiveau.trim();
  }

  filterClasses(): void {
    this.updateFilters();
  }
}
