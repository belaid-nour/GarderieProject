import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { CourseDTO } from '@core/models/course.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Import de ton breadcrumb, s’il est standalone (adapter si nécessaire)
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
  ],
  template: `
    <section class="content">

      <div class="content-block">
        <div class="block-header">
          <app-breadcrumb
            [title]="'Mes Cours'"
            [items]="['Accueil', 'Enseignant', 'Cours']"
            [active_item]="'Liste des cours'">
          </app-breadcrumb>
        </div>

        <div class="welcome-card mat-elevation-z2">
          <div class="welcome-content">
            <mat-icon class="welcome-icon">school</mat-icon>
            <div class="welcome-text">
              Bienvenue dans votre espace de gestion des cours
            </div>
          </div>
        </div>
      </div>

      <section class="hero-form-container">
        <h1 class="title">{{ isEditMode ? 'Modifier le cours' : 'Créer un nouveau cours' }}</h1>

        <form (ngSubmit)="submit()" #courseForm="ngForm" class="form" novalidate>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Titre</mat-label>
            <mat-icon matPrefix>title</mat-icon>
            <input matInput
                   [(ngModel)]="course.title"
                   name="title"
                   required
                   #title="ngModel"
                   autocomplete="off"
                   placeholder="Entrez le titre du cours" />
            <mat-error *ngIf="title.invalid && title.touched">Le titre est requis</mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Description</mat-label>
            <mat-icon matPrefix>description</mat-icon>
            <textarea matInput
                      rows="6"
                      [(ngModel)]="course.description"
                      name="description"
                      placeholder="Description du cours (optionnel)"></textarea>
          </mat-form-field>

          <div class="file-input-wrapper">
            <label for="fileInput" class="file-label">
              <mat-icon>attach_file</mat-icon>
              {{ isEditMode ? 'Changer le fichier du cours (optionnel)' : 'Fichier du cours *' }}
            </label>
            <input
              id="fileInput"
              type="file"
              (change)="onFileSelected($event)"
              [required]="!isEditMode" />
          </div>

          <div class="button-group">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="courseForm.invalid"
              class="btn-submit">
              {{ isEditMode ? 'Mettre à jour' : 'Créer' }}
            </button>
            <button
              mat-stroked-button
              color="warn"
              type="button"
              (click)="cancel()"
              class="btn-cancel">
              Annuler
            </button>
          </div>
        </form>
      </section>

    </section>
  `,
  styles: [`
    /* Content wrapper */
    .content {
      max-width: 900px;
      margin: 2rem auto 4rem;
      padding: 0 1rem;
      font-family: 'Poppins', sans-serif;
      color: #34495e;
    }

    .content-block {
      margin-bottom: 3rem;
    }

    .block-header {
      margin-bottom: 1rem;
    }

    /* Welcome Card */
    .welcome-card {
      display: flex;
      align-items: center;
      background: #e8f0fe;
      border-radius: 20px;
      padding: 1.8rem 2.4rem;
      box-shadow: 0 6px 15px rgba(63,81,181,0.12);
    }

    .welcome-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-icon {
      font-size: 3.4rem;
      color: #3f51b5;
    }

    .welcome-text {
      font-size: 1.3rem;
      font-weight: 600;
      color: #2c3e50;
      user-select: text;
    }

    /* Form container */
    .hero-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 3rem 3.5rem;
      background: linear-gradient(135deg, #f3f7ff, #e8ecff);
      border-radius: 24px;
      box-shadow:
        0 16px 30px rgba(63, 81, 181, 0.15),
        0 6px 15px rgba(63, 81, 181, 0.1);
      color: #2c3e50;
      user-select: none;
      transition: box-shadow 0.3s ease;
    }
    .hero-form-container:hover {
      box-shadow:
        0 20px 40px rgba(63, 81, 181, 0.25),
        0 8px 20px rgba(63, 81, 181, 0.15);
    }

    .title {
      font-weight: 700;
      font-size: 2.8rem;
      color: #34495e;
      margin-bottom: 3rem;
      text-align: center;
      letter-spacing: 0.07em;
      user-select: text;
    }

    .full-width {
      width: 100%;
      margin-bottom: 2rem;
    }

    mat-form-field {
      background: white;
      border-radius: 12px;
    }

    .file-input-wrapper {
      margin: 2.2rem 0 3rem;
      display: flex;
      flex-direction: column;
      user-select: none;
    }
    .file-label {
      font-weight: 600;
      font-size: 1.2rem;
      color: #34495e;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.3s ease;
      user-select: none;
    }
    .file-label:hover {
      color: #2c3e50;
    }
    input[type="file"] {
      margin-top: 0.8rem;
      cursor: pointer;
      border-radius: 12px;
      border: 2px dashed #3f51b5;
      padding: 12px 14px;
      background: #fafaff;
      transition: border-color 0.3s ease;
    }
    input[type="file"]:focus {
      outline: none;
      border-color: #283593;
      box-shadow: 0 0 10px #283593aa;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 1.6rem;
      flex-wrap: wrap;
    }
    .btn-submit {
      min-width: 140px;
      font-weight: 700;
      letter-spacing: 0.06em;
      box-shadow: 0 8px 16px rgba(63, 81, 181, 0.35);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      border-radius: 12px;
      padding: 0.75rem 1.8rem;
    }
    .btn-submit:hover:not(:disabled) {
      background-color: #283593;
      box-shadow: 0 12px 24px rgba(40, 53, 147, 0.6);
    }
    .btn-submit:disabled {
      background-color: #9fa8da;
      cursor: not-allowed;
      box-shadow: none;
    }
    .btn-cancel {
      min-width: 120px;
      font-weight: 600;
      letter-spacing: 0.05em;
      border-color: #e74c3c;
      color: #e74c3c;
      border-radius: 12px;
      padding: 0.7rem 1.6rem;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .btn-cancel:hover {
      background-color: #e74c3c;
      color: white;
    }

    @media (max-width: 600px) {
      .content {
        margin: 1rem auto 3rem;
        padding: 0 1rem;
      }
      .hero-form-container {
        padding: 2.5rem 2rem;
      }
      .title {
        font-size: 2.2rem;
      }
      .button-group {
        flex-direction: column;
        gap: 1.2rem;
      }
      button {
        width: 100%;
      }
    }
  `]
})
export class CourseFormComponent implements OnInit {

  course: Partial<CourseDTO> = {
    title: '',
    description: ''
  };

  selectedFile?: File;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEditMode = true;
      this.loadCourse(id);
    }
  }

  private loadCourse(id: number): void {
    this.courseService.getCoursesByTeacher().subscribe(courses => {
      const found = courses.find(c => c.id === id);
      if (found) {
        this.course = { ...found };
      } else {
        this.snackBar.open('Cours non trouvé', 'Fermer', { duration: 3000 });
        this.router.navigate(['/teacher/courses']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  submit(): void {
    if (!this.course.title) {
      this.snackBar.open('Veuillez remplir le titre du cours', 'Fermer', { duration: 3000 });
      return;
    }

    if (this.isEditMode) {
      if (this.selectedFile) {
        this.courseService.uploadCourse(this.selectedFile, this.course as CourseDTO).subscribe({
          next: () => {
            this.snackBar.open('Cours mis à jour avec fichier', 'Fermer', { duration: 3000 });
            this.router.navigate(['/teacher/courses']);
          },
          error: () => {
            this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        this.courseService.updateCourse(this.course as CourseDTO).subscribe({
          next: () => {
            this.snackBar.open('Cours mis à jour', 'Fermer', { duration: 3000 });
            this.router.navigate(['/teacher/courses']);
          },
          error: () => {
            this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          }
        });
      }
    } else {
      if (!this.selectedFile) {
        this.snackBar.open('Veuillez sélectionner un fichier pour le cours', 'Fermer', { duration: 3000 });
        return;
      }
      this.courseService.uploadCourse(this.selectedFile, this.course as CourseDTO).subscribe({
        next: () => {
          this.snackBar.open('Cours créé avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/teacher/courses']);
        },
        error: () => {
          this.snackBar.open('Erreur lors de la création du cours', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/teacher/courses']);
  }
}
