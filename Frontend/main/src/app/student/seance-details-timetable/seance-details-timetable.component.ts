import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/service/auth.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import moment from 'moment'; // Correction de l'import

import { EnfantService } from '@core/service/students.service';
import { ClasseService } from '@core/service/classe.service';
import { SeanceService } from '@core/service/seance.service';
import { Enfant, Classe } from '@core/models/students.model';
import { Seance } from '@core/models/seance.model';
import { User } from '@core/models/user';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-timetable',
  templateUrl: './seance-details-timetable.component.html',
  styleUrls: ['./seance-details-timetable.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ]
})
export class TimetableComponent implements OnInit {
  enfantsAvecClasse: Array<{ enfant: Enfant; classe: Classe | null }> = [];
  seancesParClasse: { [classeId: number]: Seance[] } = {};
  erreurMessage = '';
  loading = false;

  today = moment();
  currentWeek = moment();
  days: { name: string; date: moment.Moment }[] = [];
  timeSlots: string[] = [];

  get currentWeekStart(): Date {
    return this.currentWeek.clone().startOf('isoWeek').toDate();
  }

  get currentWeekEnd(): Date {
    return this.currentWeek.clone().endOf('isoWeek').toDate();
  }

  constructor(
    private authService: AuthService,
    private enfantService: EnfantService,
    private classeService: ClasseService,
    private seanceService: SeanceService,
  ) {}

  ngOnInit(): void {
    this.initializeTimeSlots();
    this.initializeWeekDays();
    this.loadEnfantsEtSeances();
  }

  initializeTimeSlots(): void {
    this.timeSlots = [];
    for (let h = 8; h <= 19; h++) {
      this.timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
      this.timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }

  initializeWeekDays(): void {
    this.days = [];
    const weekStart = this.currentWeek.clone().startOf('isoWeek');

    for (let i = 0; i < 5; i++) {
      const day = weekStart.clone().add(i, 'days');
      this.days.push({
        name: day.format('dddd'),
        date: day
      });
    }
  }

  previousWeek(): void {
    this.currentWeek = this.currentWeek.clone().subtract(1, 'weeks');
    this.initializeWeekDays();
    this.loadSeancesForCurrentWeek();
  }

  nextWeek(): void {
    this.currentWeek = this.currentWeek.clone().add(1, 'weeks');
    this.initializeWeekDays();
    this.loadSeancesForCurrentWeek();
  }

  loadEnfantsEtSeances() {
    this.loading = true;
    this.authService.currentUser.pipe(
      switchMap((user: User | null) => {
        if (!user?.id_utilisateur) throw new Error('Utilisateur non connecté');
        return this.enfantService.getMesEnfants();
      }),
      switchMap((enfants: Enfant[]) => {
        if (!enfants || enfants.length === 0) {
          this.enfantsAvecClasse = [];
          return of([]);
        }

        const classesObs = enfants.map(enfant => {
          if (!enfant.classeId) return of({ enfant, classe: null });
          return this.classeService.getClasseById(enfant.classeId).pipe(
            catchError(() => of(null)),
            switchMap(classe => of({ enfant, classe }))
          );
        });

        return forkJoin(classesObs);
      }),
      switchMap((enfantsAvecClasses) => {
        this.enfantsAvecClasse = enfantsAvecClasses;
        return this.loadSeancesForCurrentWeek();
      })
    ).subscribe({
      next: () => {
        this.erreurMessage = '';
        this.loading = false;
      },
      error: err => {
        this.erreurMessage = err.message || 'Erreur lors du chargement';
        this.enfantsAvecClasse = [];
        this.seancesParClasse = {};
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadSeancesForCurrentWeek() {
    const classeIds = Array.from(new Set(
      this.enfantsAvecClasse
        .map(e => e.classe?.id)
        .filter(id => id != null) as number[]
    ));

    if (classeIds.length === 0) return of({});

    const startDate = this.currentWeek.clone().startOf('isoWeek').format('YYYY-MM-DD');
    const endDate = this.currentWeek.clone().endOf('isoWeek').format('YYYY-MM-DD');

    const seancesObs = classeIds.map(classeId =>
      this.seanceService.getSeancesByDateRange(classeId, startDate, endDate).pipe(
        catchError((error) => {
          console.error('Erreur chargement séances:', error);
          return of([]);
        })
      )
    );

    return forkJoin(seancesObs).pipe(
      switchMap(seancesArrays => {
        this.seancesParClasse = {};
        classeIds.forEach((id, idx) => this.seancesParClasse[id] = seancesArrays[idx]);

        // Debug
        console.log('Séances chargées:', this.seancesParClasse);
        return of(this.seancesParClasse);
      })
    );
  }

  getSeancesForClasseAt(classeId: number, date: moment.Moment, time: string): Seance[] {
    if (!this.seancesParClasse[classeId]) return [];

    const seances = this.seancesParClasse[classeId];
    const targetDate = date.format('YYYY-MM-DD');

    const filtered = seances.filter(seance => {
      // Formater la date de la séance

      // Comparer l'heure de début
      const startTime = seance.horaireDebut?.substring(0, 5);

    });

    console.log(`Séances pour ${targetDate} à ${time}:`, filtered);
    return filtered;
  }

  getGridRow(seance: Seance): string {
    if (!seance.horaireDebut || !seance.horaireFin) return 'auto';

    try {
      const start = moment(seance.horaireDebut, 'HH:mm');
      const end = moment(seance.horaireFin, 'HH:mm');

      if (!start.isValid() || !end.isValid()) return 'auto';

      const duration = moment.duration(end.diff(start));
      const minutes = duration.asMinutes();
      const spanCount = Math.ceil(minutes / 30);

      return `span ${spanCount}`;
    } catch (e) {
      console.error('Erreur calcul durée:', e);
      return 'auto';
    }
  }
}
