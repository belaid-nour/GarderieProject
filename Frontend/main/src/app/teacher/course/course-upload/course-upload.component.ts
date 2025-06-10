// course-upload.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '@core/service/course.service';
import { ClasseService } from '@core/service/classe.service';
import { CourseDTO } from '@core/models/course.model';
import { Classe } from '@core/models/classe.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-course-upload',
  standalone: true,
  templateUrl: './course-upload.component.html',
  styleUrls: ['./course-upload.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    BreadcrumbComponent
  
  ]
})
export class CourseUploadComponent implements OnInit {
  @Output() uploadSuccess = new EventEmitter<void>();
  uploadForm: FormGroup;
  classes: Classe[] = [];
  selectedFile: File | null = null;
  isLoading = false;
  isLoadingClasses = true;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private classeService: ClasseService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(300)]],
      classeId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClasses();
  }

  private loadClasses(): void {
    this.classeService.getAllClasses().subscribe({
      next: (data) => {
        this.classes = data;
        this.isLoadingClasses = false;
      },
      error: (err) => {
        this.snackBar.open('Erreur de chargement des classes', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoadingClasses = false;
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onCancel(): void {
    this.router.navigate(['/teacher/courses']);
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isLoading = true;
      const courseDto: CourseDTO = this.uploadForm.value;

      this.courseService.uploadCourse(this.selectedFile, courseDto).subscribe({
        next: () => {
          this.snackBar.open('Cours publié avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/teacher/courses']);
        },
        error: (err) => {
          this.snackBar.open(`Erreur: ${err.error?.message || 'Échec de publication'}`, 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    }
  }
}
