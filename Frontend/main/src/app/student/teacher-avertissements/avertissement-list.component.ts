import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { forkJoin, of, Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { AvertissementService } from '@core/service/avertissement.service';
import { EnfantService } from '@core/service/students.service';
import { AuthService } from '@core/service/auth.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { SafeDatePipe } from '@shared/safe-date.pipe';

import { Enfant } from '@core/models/students.model';
import { User } from '@core/models/user';
import { Avertissement } from '@core/models/avertissement.model';

@Component({
  selector: 'app-avertissement-list',
  templateUrl: './avertissement-list.component.html',
  styleUrls: ['./avertissement-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    SafeDatePipe
  ]
})
export class AvertissementListComponent implements OnInit {
  enfantsAvertissements: {
    enfant: Enfant;
    avertissements: Avertissement[]
  }[] = [];
  loading = true;
  errorMessage = '';
  totalAvertissements = 0;

  displayedColumns: string[] = [
    'date',
    'titre',
    'description',
    'severite',
    'enseignant'
  ];

  constructor(
    private authService: AuthService,
    private enfantService: EnfantService,
    private avertissementService: AvertissementService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.currentUser.pipe(
      switchMap((user: User | null) => {
        if (!user?.id_utilisateur) {
          throw new Error('Utilisateur non connecté');
        }
        return this.enfantService.getMesEnfants();
      }),
      switchMap((enfants: Enfant[]) => {
        if (enfants.length === 0) {
          throw new Error('Aucun enfant trouvé');
        }

        const requests: Observable<Avertissement[]>[] = enfants.map(enfant =>
          this.avertissementService.getAvertissementsByEnfant(enfant.id).pipe(
            catchError(() => of([] as Avertissement[]))
          )
        );

        return forkJoin(requests).pipe(
          map((avertissementsArrays: Avertissement[][]) => {
            return enfants.map((enfant, idx) => ({
              enfant,
              avertissements: avertissementsArrays[idx]
            }));
          })
        );
      })
    ).subscribe({
      next: (data: { enfant: Enfant; avertissements: Avertissement[] }[]) => {
        this.enfantsAvertissements = data;
        this.totalAvertissements = data.reduce((acc, curr) => acc + curr.avertissements.length, 0);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors du chargement des avertissements';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteAvertissement(avertissementId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avertissement ?')) {
      this.avertissementService.deleteAvertissement(avertissementId).subscribe({
        next: () => {
          this.enfantsAvertissements.forEach(item => {
            item.avertissements = item.avertissements.filter(a => a.id !== avertissementId);
          });
          this.totalAvertissements--;
        },
        error: (err) => {
          console.error('Erreur de suppression:', err);
          alert('Erreur lors de la suppression de l\'avertissement');
        }
      });
    }
  }

  countBySeverity(severity: string): number {
    return this.enfantsAvertissements.reduce((acc, curr) => {
      return acc + curr.avertissements.filter(a => a.severite === severity).length;
    }, 0);
  }
}
