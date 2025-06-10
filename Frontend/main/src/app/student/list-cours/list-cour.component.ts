import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { forkJoin, of, Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { CourseService } from '@core/service/course.service';
import { EnfantService } from '@core/service/students.service';
import { AuthService } from '@core/service/auth.service';
import { ClasseService } from '@core/service/classe.service';

import { CourseDTO } from '@core/models/course.model';
import { Enfant } from '@core/models/students.model';
import { Classe } from '@core/models/classe.model';
import { User } from '@core/models/user';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

interface ClasseData {
  classe: Classe;
  enfants: Enfant[];
  cours: CourseDTO[];
}

@Component({
  selector: 'app-course-list',
  templateUrl: './list-cour.component.html',
  styleUrls: ['./list-cour.component.scss'],
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
    DatePipe
  ]
})
export class CourseListComponent implements OnInit {
  classesData: ClasseData[] = [];
  enfants: Enfant[] = [];
  classes: Classe[] = [];
  loading = true;
  errorMessage = '';
  totalCours = 0;

  displayedColumns: string[] = [
    'titre',
    'description',
    'date',
    'enseignant',
    'actions'
  ];

  constructor(
    private authService: AuthService,
    private enfantService: EnfantService,
    private classeService: ClasseService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.errorMessage = '';
    this.classesData = [];

    this.authService.currentUser.pipe(
      switchMap((user: User | null) => {
        if (!user?.id_utilisateur) {
          throw new Error('Utilisateur non connecté');
        }
        return this.enfantService.getMesEnfants();
      }),
      switchMap((enfants: Enfant[]) => {
        this.enfants = enfants;
        if (enfants.length === 0) {
          return of([] as ClasseData[]);
        }

        const classIds = [...new Set(enfants.map(e => e.classeId).filter((id): id is number => !!id))];
        if (classIds.length === 0) {
          return of([] as ClasseData[]);
        }

        // Correction principale ici - pipe doit être appliqué à chaque observable individuellement
        const classesObservables = classIds.map(id =>
          this.classeService.getClasseById(id).pipe(
            catchError(() => of(null)) // Gérer le cas où la classe n'est pas trouvée
        ));

        return forkJoin(classesObservables).pipe(
          switchMap((classes: (Classe | null)[]) => {
            // Filtrer les classes null et convertir en type Classe[]
            const validClasses = classes.filter((c): c is Classe => c !== null);
            this.classes = validClasses;

            if (validClasses.length === 0) {
              return of([] as ClasseData[]);
            }

            const classeDataObservables = validClasses.map(classe =>
              forkJoin({
                cours: this.courseService.getCoursesByClasse(classe.id).pipe(
                  catchError(() => of([] as CourseDTO[]))
                ),
                enfants: of(enfants.filter(e => e.classeId === classe.id))
              }).pipe(
                map(({ cours, enfants }) => ({
                  classe,
                  enfants,
                  cours
                } as ClasseData))
              )
            );

            return forkJoin(classeDataObservables);
          })
        );
      }),
      catchError(err => {
        this.errorMessage = err.message || 'Erreur lors du chargement des données';
        this.loading = false;
        return of([] as ClasseData[]);
      })
    ).subscribe({
      next: (data: ClasseData[]) => {
        this.classesData = data;
        this.totalCours = data.reduce((acc, curr) => acc + curr.cours.length, 0);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des données';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  getDownloadUrl(courseId: number): string {
    return `http://localhost:8081/api/courses/download/${courseId}`;
  }
}
