import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { AbsenceService } from '@core/service/absence.service';
import { EnfantService } from '@core/service/students.service';
import { AuthService } from '@core/service/auth.service';

import { Absence } from '@core/models/absence.model';
import { Enfant } from '@core/models/students.model';
import { User } from '@core/models/user';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

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
    MatTooltipModule
  ]
})
export class AbsenceListComponent implements OnInit {
  enfantsAbsences: { enfant: Enfant; absences: Absence[] }[] = [];
  loading = true;
  errorMessage = '';

  // Métriques pour le tableau de bord
  totalAbsences = 0;
  justificationRate = 0;
  enfantsCount = 0;

  constructor(
    private authService: AuthService,
    private enfantService: EnfantService,
    private absenceService: AbsenceService,
    private dialog: MatDialog
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

        // Initialiser les métriques
        this.enfantsCount = enfants.length;

        // Récupérer absences par enfant
        return forkJoin(
          enfants.map(enfant =>
            this.absenceService.getAbsencesByEnfant(enfant.id).pipe(
              catchError(() => of([] as Absence[]))
            )
          )
        ).pipe(
          switchMap((absencesArrays: Absence[][]) => {
            const result = enfants.map((enfant, idx) => ({
              enfant,
              absences: absencesArrays[idx]
            }));

            // Calculer les métriques
            this.calculateMetrics(result);
            return of(result);
          })
        );
      })
    ).subscribe({
      next: (data) => {
        this.enfantsAbsences = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  private calculateMetrics(data: { enfant: Enfant; absences: Absence[] }[]): void {
    this.totalAbsences = 0;
    let justifiedCount = 0;

    data.forEach(item => {
      this.totalAbsences += item.absences.length;
      justifiedCount += item.absences.filter(a => a.justifiee).length;
    });

    this.justificationRate = this.totalAbsences > 0
      ? justifiedCount / this.totalAbsences
      : 0;
  }


  deleteAbsence(absenceId: number): void {
    if (confirm('Confirmer la suppression de cette absence ?')) {
      this.absenceService.deleteAbsence(absenceId).subscribe({
        next: () => {
          // Supprimer l'absence de la liste
          this.enfantsAbsences.forEach(item => {
            item.absences = item.absences.filter(a => a.id !== absenceId);
          });
          // Recalculer les métriques
          this.calculateMetrics(this.enfantsAbsences);
        },
        error: (err) => {
          console.error('Erreur de suppression:', err);
        }
      });
    }
  }

  updateAbsenceStatus(absence: Absence, justifiee: boolean): void {
    this.absenceService.updateAbsenceStatus(absence.id, justifiee).subscribe({
      next: (updatedAbsence) => {
        absence.justifiee = updatedAbsence.justifiee;
        // Recalculer les métriques
        this.calculateMetrics(this.enfantsAbsences);
      },
      error: (err) => {
        console.error('Erreur de mise à jour:', err);
      }
    });
  }
}
