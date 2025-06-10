import { Component, OnInit } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import { CourseDTO } from '@core/models/course.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

// Angular Material modules nécessaires
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

// Composant breadcrumb (standalone)
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatProgressSpinnerModule,
    RouterModule,
    MatTooltipModule,
    BreadcrumbComponent
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courses: CourseDTO[] = [];
  displayedColumns: string[] = ['title', 'description', 'uploadDate', 'actions'];
  isLoading = true;
  errorMessage?: string;

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getCoursesByTeacher().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Erreur lors du chargement des cours');
        this.isLoading = false;
      }
    });
  }

  deleteCourse(courseId: number): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer définitivement ce cours ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(courseId).subscribe({
          next: () => {
            this.courses = this.courses.filter(c => c.id !== courseId);
            this.showSuccess('Cours supprimé avec succès');
          },
          error: () => {
            this.handleError('Erreur lors de la suppression du cours');
          }
        });
      }
    });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
