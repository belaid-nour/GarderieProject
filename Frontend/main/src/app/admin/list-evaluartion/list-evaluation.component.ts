import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationService, Evaluation } from '@core/service/evaluation.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableExportUtil } from '@shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './list-evaluation.component.html',
  styleUrls: ['./list-evaluation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    PercentPipe
  ]
})
export class EvaluationListComponent implements OnInit, AfterViewInit {
  evaluations: Evaluation[] = [];
  dataSource: MatTableDataSource<Evaluation>;
  displayedColumns: string[] = ['enfant', 'classe', 'date', 'commentaire', 'analyse', 'actions'];
  enfantId?: number;
  classeId?: number;
  loading = false;
  errorMessage = '';
  currentView: 'enfant' | 'classe' = 'classe';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private evaluationService: EvaluationService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Evaluation>(this.evaluations);
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadInitialData() {
    this.loadByClasse(1); // Charge par défaut les évaluations pour la classe 1
  }

  private handleRequest(
    request$: Observable<Evaluation[]>,
    viewType: 'enfant' | 'classe',
    id?: number
  ) {
    this.loading = true;
    this.resetState();
    this.currentView = viewType;

    request$.subscribe({
      next: (evals) => {
        this.evaluations = evals;
        this.dataSource.data = evals;
        this.loading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  loadByEnfant(enfantId: number): void {
    this.handleRequest(
      this.evaluationService.getByEnfant(enfantId),
      'enfant',
      enfantId
    );
  }

  loadByClasse(classeId: number): void {
    this.handleRequest(
      this.evaluationService.getByClasse(classeId),
      'classe',
      classeId
    );
  }

  reanalyze(evaluationId: number): void {
    this.loading = true;
    this.evaluationService.reanalyze(evaluationId).subscribe({
      next: (updated) => {
        this.evaluations = this.evaluations.map(e =>
          e.id === evaluationId ? updated : e
        );
        this.dataSource.data = this.evaluations;
        this.loading = false;
        this.snackBar.open('Analyse IA mise à jour', 'Fermer', { duration: 3000 });
      },
      error: (err) => this.handleError(err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refresh(): void {
    if (this.currentView === 'enfant' && this.enfantId) {
      this.loadByEnfant(this.enfantId);
    } else if (this.currentView === 'classe' && this.classeId) {
      this.loadByClasse(this.classeId);
    }
  }



  private handleError(error: Error) {
    this.errorMessage = error.message;
    this.loading = false;
    console.error('Erreur API:', error);
    this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
  }

  private resetState() {
    this.evaluations = [];
    this.dataSource.data = [];
    this.errorMessage = '';
  }

  getSentimentColor(sentiment?: string): string {
    switch(sentiment?.toUpperCase()) {
      case 'POSITIF': return 'rgba(212, 237, 218, 0.3)';
      case 'NÉGATIF': return 'rgba(248, 215, 218, 0.3)';
      case 'NEUTRE': return 'rgba(255, 243, 205, 0.3)';
      default: return 'transparent';
    }
  }
}
