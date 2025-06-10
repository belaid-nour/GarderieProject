import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { Evaluation, EvaluationDTO, Seance, Enfant } from './evaluation.model';
import { SeanceService } from './seance.service';
import { EvaluationService } from './evaluation.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BreadcrumbComponent
  ],
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.scss']
})
export class EvaluationListComponent implements OnInit {
  seance!: Seance;
  evaluations: Evaluation[] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'commentaire', 'actions'];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private seanceService: SeanceService,
    private evaluationService: EvaluationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const seanceId = +this.route.snapshot.params['seanceId'];
    this.loadData(seanceId);
  }

  private loadData(seanceId: number): void {
    forkJoin([
      this.seanceService.getSeanceById(seanceId),
      this.evaluationService.getEvaluationsBySeance(seanceId)
    ]).subscribe({
      next: ([seance, evaluations]) => this.processData(seance, evaluations),
      error: (err) => this.handleError(err)
    });
  }

  private processData(seance: Seance, evaluations: Evaluation[]): void {
    this.seance = seance;
    this.seanceService.getElevesByClasse(seance.classe.id).subscribe({
      next: (eleves) => this.mergeEvaluations(eleves, evaluations),
      error: (err) => this.handleError(err)
    });
  }

  private mergeEvaluations(eleves: Enfant[], existingEvaluations: Evaluation[]): void {
    this.evaluations = eleves.map(eleve => {
      const evaluation = existingEvaluations.find(e => e.enfant?.id === eleve.id);
      return evaluation || this.createNewEvaluation(eleve);
    });
    this.isLoading = false;
  }

  private createNewEvaluation(eleve: Enfant): Evaluation {
   return {
      id: 0, // ID temporaire
      commentaire: '',
      date: new Date().toISOString(),
      enfantId: eleve.id,
      seanceId: this.seance.id,
      enfant: eleve,
      seance: this.seance
    };
  }

  onEvaluationChange(evaluation: Evaluation): void {
    if (evaluation.id !== 0) {
      this.updateEvaluation(evaluation);
    } else {
      this.createEvaluation(evaluation);
    }
  }

  private createEvaluation(evaluation: Evaluation): void {
    const dto: EvaluationDTO = {
      enfantId: evaluation.enfantId,
      seanceId: evaluation.seanceId,
      date: evaluation.date,
      commentaire: evaluation.commentaire
    };

    this.evaluationService.createEvaluation(dto).subscribe({
      next: (newEvaluation) => {
        evaluation.id = newEvaluation.id;
        this.showMessage('Évaluation enregistrée');
      },
      error: (err) => this.handleError(err)
    });
  }

  private updateEvaluation(evaluation: Evaluation): void {
    const dto: EvaluationDTO = {
      enfantId: evaluation.enfantId,
      seanceId: evaluation.seanceId,
      date: evaluation.date,
      commentaire: evaluation.commentaire
    };

    this.evaluationService.updateEvaluation(evaluation.id, dto).subscribe({
      next: () => this.showMessage('Évaluation mise à jour'),
      error: (err) => this.handleError(err)
    });
  }



  confirmExit(): void {
    Swal.fire({
      title: 'Confirmer la sortie',
      text: 'Évaluations enregistrées avec succès. Voulez-vous vraiment quitter ?',
      icon: 'success',
      confirmButtonText: 'Quitter',
      cancelButtonText: 'Annuler',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        window.history.back();
      }
    });
  }

  deleteEvaluation(evaluation: Evaluation): void {
    if (confirm('Confirmer la suppression ?') && evaluation.id !== 0) {
      this.evaluationService.deleteEvaluation(evaluation.id).subscribe({
        next: () => {
          this.evaluations = this.evaluations.filter(e => e.id !== evaluation.id);
          this.showMessage('Évaluation supprimée');
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(error: any): void {
    console.error(error);
    this.errorMessage = 'Erreur lors du chargement des données';
    this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
    this.isLoading = false;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 2000 });
  }
}
