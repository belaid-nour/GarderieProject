import { Component, OnInit } from '@angular/core';
import { SeanceService } from './seance.service';
import { Seance } from './seance.model';
import { DatePipe, CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import Swal from 'sweetalert2';

type FilterType = 'all' | 'today' | 'week' | 'month';

interface Filter {
  key: FilterType;
  label: string;
}

@Component({
  selector: 'app-teacher-seance-list',
  standalone: true,
  templateUrl: './seance-list.component.html',
  styleUrls: ['./seance-list.component.scss'],
  providers: [DatePipe],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonToggleModule,
    BreadcrumbComponent
  ]
})
export class TeacherSeanceListComponent implements OnInit {
  filters: Filter[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'today', label: 'Aujourd\'hui' },
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' }
  ];

  seances: Seance[] = [];
  filteredSeances: Seance[] = [];
  displayedColumns: string[] = ['nom', 'classe', 'horaire', 'date', 'lieu', 'actions'];
  isLoading = true;
  errorMessage: string | null = null;
  activeFilter: FilterType = 'all';

  breadscrums = [
    {
      title: 'Gestion des Séances',
      items: ['Enseignant'],
      active: 'Mes Séances'
    }
  ];

  constructor(
    private seanceService: SeanceService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSeances();
  }

  private loadSeances(): void {
    this.seanceService.getTeacherSeances().subscribe({
      next: (data) => {
        this.seances = data;
        this.applyFilter('all');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
        this.showError(err.message || 'Échec du chargement des séances');
      }
    });
  }

  applyFilter(filter: FilterType): void {
    this.activeFilter = filter;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.filteredSeances = this.seances.filter(seance => {
      if (!seance.startDate) return filter === 'all';

      const seanceDate = this.parseDate(seance.startDate);
      if (!seanceDate) return false;

      seanceDate.setHours(0, 0, 0, 0);

      switch(filter) {
        case 'today': return this.isSameDay(seanceDate, today);
        case 'week': return this.isSameWeek(seanceDate, today);
        case 'month': return this.isSameMonth(seanceDate, today);
        default: return true;
      }
    });
  }

  manageAbsence(seance: Seance): void {
    if (this.isSeanceToday(seance)) {
      this.router.navigate(['/teacher/absence/absence-list', seance.id]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Action non autorisée',
        text: 'Vous ne pouvez pas gérer les absences pour une séance qui n\'est pas aujourd\'hui.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  }

  manageEvaluation(seance: Seance): void {
    if (this.isSeanceToday(seance)) {
      this.router.navigate(['/teacher/evaluation/evaluation-list', seance.id]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Action non autorisée',
        text: 'Vous ne pouvez pas gérer les évaluations pour une séance qui n\'est pas aujourd\'hui.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  }

  private isSeanceToday(seance: Seance): boolean {
    const seanceDate = this.parseDate(seance.startDate);
    if (!seanceDate) return false;

    const today = new Date();
    return this.isSameDay(seanceDate, today);
  }

  private parseDate(dateStr: string): Date | null {
    try {
      if (dateStr.includes('T')) {
        const [datePart] = dateStr.split('T');
        const [year, month, day] = datePart.split('-');
        return new Date(+year, +month - 1, +day);
      }
      if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-');
        return new Date(+year, +month - 1, +day);
      }
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return new Date(+year, +month - 1, +day);
      }
      throw new Error('Format non reconnu');
    } catch (e) {
      console.error('Erreur de parsing de date:', dateStr, e);
      return null;
    }
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  private isSameWeek(date: Date, today: Date): boolean {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    return date >= startOfWeek && date <= endOfWeek;
  }

  private isSameMonth(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth();
  }

  formatTime(time: string): string {
    if (!time) return '--:--';

    if (time.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      return time.substring(0, 5);
    }

    try {
      const date = new Date(time);
      return this.datePipe.transform(date, 'HH:mm') || '--:--';
    } catch {
      return '--:--';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '--/--/----';

    try {
      const date = this.parseDate(dateStr);
      if (!date) return '--/--/----';
      return this.datePipe.transform(date, 'dd/MM/yyyy') || '--/--/----';
    } catch (e) {
      console.error('Erreur de formatage de date:', dateStr, e);
      return '--/--/----';
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
