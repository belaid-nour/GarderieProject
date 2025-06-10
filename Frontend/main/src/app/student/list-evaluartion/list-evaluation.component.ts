import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { forkJoin, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { EvaluationService } from '@core/service/evaluation.service';
import { EnfantService } from '@core/service/students.service';
import { AuthService } from '@core/service/auth.service';

import { Evaluation } from '@core/models/evaluation.model';
import { Enfant } from '@core/models/students.model';
import { User } from '@core/models/user';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './list-evaluation.component.html',
  styleUrls: ['./list-evaluation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    DatePipe,
    PercentPipe
  ]
})
export class EvaluationListComponent implements OnInit {
  enfantsEvaluations: {
    enfant: Enfant;
    evaluations: Evaluation[];
  }[] = [];

  loading = true;
  errorMessage = '';
  totalEvaluations = 0;
  averageConfidence = 0;
  positivePercentage = 0;

  displayedColumns: string[] = [
    'date',
    'seance',
    'sentiment',
    'confidence',
    'themes',
    'commentaire',
    'actions'
  ];

  constructor(
    private authService: AuthService,
    private enfantService: EnfantService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.loadEvaluations();
  }

  loadEvaluations(): void {
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
          return of([]);
        }

        const evaluationRequests = enfants.map(enfant =>
          this.evaluationService.getByEnfant(enfant.id).pipe(
            catchError(() => of([] as Evaluation[]))
          )
        );

        return forkJoin(evaluationRequests).pipe(
          map((evaluationsArrays: Evaluation[][]) => {
            return enfants.map((enfant, index) => ({
              enfant,
              evaluations: evaluationsArrays[index]
            }));
          })
        );
      }),
      catchError(err => {
        this.errorMessage = 'Erreur lors du chargement des données';
        this.loading = false;
        console.error('Erreur:', err);
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.enfantsEvaluations = data;
        this.calculateMetrics();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des données';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  calculateMetrics(): void {
    let totalEvals = 0;
    let totalConfidence = 0;
    let positiveCount = 0;

    this.enfantsEvaluations.forEach(item => {
      item.evaluations.forEach(evaluation => {
        totalEvals++;
        if (evaluation.confidence) {
          totalConfidence += evaluation.confidence;
        }
        if (evaluation.sentiment?.toUpperCase() === 'POSITIF') {
          positiveCount++;
        }
      });
    });

    this.totalEvaluations = totalEvals;
    this.averageConfidence = totalEvals > 0 ? totalConfidence / totalEvals : 0;
    this.positivePercentage = totalEvals > 0 ? positiveCount / totalEvals : 0;
  }

  getSentimentClass(sentiment?: string): string {
    if (!sentiment) return 'default';

    const sentimentUpper = sentiment.toUpperCase();
    const classMap: Record<string, string> = {
      'POSITIF': 'positif',
      'NÉGATIF': 'negatif',
      'NEUTRE': 'neutre'
    };
    return classMap[sentimentUpper] || 'default';
  }

  getSentimentIcon(sentiment?: string): string {
    if (!sentiment) return 'help_outline';

    const sentimentUpper = sentiment.toUpperCase();
    const iconMap: Record<string, string> = {
      'POSITIF': 'sentiment_very_satisfied',
      'NÉGATIF': 'sentiment_very_dissatisfied',
      'NEUTRE': 'sentiment_neutral'
    };
    return iconMap[sentimentUpper] || 'help_outline';
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'primary';
    if (confidence >= 0.5) return 'accent';
    return 'warn';
  }
}
