import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvertissementService } from '@core/service/avertissement.service';
import { AuthService } from '@core/service/auth.service';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-avertissement-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    BreadcrumbComponent,
  ],
  templateUrl: './avertissement-list.component.html',
  styleUrls: ['./avertissement-list.component.scss']
})
export class TeacherAvertissementsComponent implements OnInit {

  avertissements: any[] = [];
  errorMessage: string = '';
  isLoading = false;

  displayedColumns: string[] = ['titre', 'description', 'severite', 'dateCreation', 'enfant'];

  severiteLabels: Record<string, string> = {
    LEGERE: 'Légère',
    MODEREE: 'Modérée',
    GRAVE: 'Grave'
  };

  constructor(
    private avertissementService: AvertissementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAvertissements();
  }

  loadAvertissements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const enseignantId = this.authService.getCurrentUserId();
    if (!enseignantId) {
      this.errorMessage = "Enseignant non identifié";
      this.isLoading = false;
      return;
    }

    this.avertissementService.getAvertissementsByEnseignant(enseignantId).subscribe({
      next: (data) => {
        this.avertissements = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement avertissements', err);
        this.errorMessage = 'Erreur lors du chargement des avertissements';
        this.isLoading = false;
      }
    });
  }
}
