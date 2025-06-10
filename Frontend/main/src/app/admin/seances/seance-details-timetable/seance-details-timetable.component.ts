import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeanceService } from '../seance-list/seance.service';
import { ClasseService } from '../seance-list/classe.service';
import { Seance, Classe } from '../seance-list/seance.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';


import moment from 'moment';

@Component({
  selector: 'app-timetable',
  templateUrl: './seance-details-timetable.component.html',
  styleUrls: ['./seance-details-timetable.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,    BreadcrumbComponent,
  ]
})
export class TimetableComponent implements OnInit {
  classes: Classe[] = [];
  seances: Seance[] = [];
  selectedDate: Date = new Date();
  weekDays: { date: Date }[] = [];
  timeSlots: string[] = [];
  selectedSeance: Seance | null = null;
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private seanceService: SeanceService,
    private classeService: ClasseService
  ) { }

  ngOnInit() {
    this.generateWeekDays();
    this.loadData();
  }

  get filteredClasses(): Classe[] {
    return this.classes
      .filter(classe =>
        classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const compare = a.nom.localeCompare(b.nom);
        return this.sortOrder === 'asc' ? compare : -compare;
      });
  }
// Ajouts dans le composant TypeScript
generateTimeSlots(): string[] {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

hasSeanceAtTime(classeId: number, date: Date, time: string): boolean {
  return this.getSeancesAtTime(classeId, date, time).length > 0;
}

getSeancesAtTime(classeId: number, date: Date, time: string): Seance[] {
  const targetTime = moment(time, 'HH:mm');
  return this.getSeancesForDay(classeId, date).filter(seance => {
    const start = moment(seance.horaireDebut, 'HH:mm');
    const end = moment(seance.horaireFin, 'HH:mm');
    return targetTime.isBetween(start, end, null, '[)');
  });
}

getClassSchedule(classe: Classe): string {
  const hours = this.seances
    .filter(s => s.classe.id === classe.id)
    .map(s => `${s.horaireDebut}-${s.horaireFin}`);
  return [...new Set(hours)].join(', ');
}
  private generateWeekDays() {
    const startOfWeek = moment(this.selectedDate).startOf('isoWeek');
    this.weekDays = [];

    for (let i = 0; i < 5; i++) {
      this.weekDays.push({
        date: startOfWeek.clone().add(i, 'days').toDate()
      });
    }
  }

  async loadData() {
    try {
      this.classes = await this.classeService.getAllClasses().toPromise() || [];
      const allSeances = await this.seanceService.getAllSeances().toPromise() || [];
      this.seances = allSeances;
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  handleDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedDate = new Date(target.value);
    this.generateWeekDays();
  }

  previousWeek() {
    this.selectedDate = moment(this.selectedDate).subtract(1, 'week').toDate();
    this.generateWeekDays();
  }

  nextWeek() {
    this.selectedDate = moment(this.selectedDate).add(1, 'week').toDate();
    this.generateWeekDays();
  }

  getSeancesForDay(classeId: number, date: Date): Seance[] {
    const dayMoment = moment(date);
    return this.seances.filter(seance =>
      seance.classe.id === classeId &&
      this.isSeanceActive(seance, dayMoment)
    );
  }

  private isSeanceActive(seance: Seance, day: moment.Moment): boolean {
    const startDate = moment(seance.startDate, 'DD/MM/YYYY');
    const endDate = moment(seance.endDate, 'DD/MM/YYYY');

    if (!day.isBetween(startDate, endDate, 'day', '[]')) return false;

    switch(seance.recurrenceType) {
      case 'AUCUNE':
        return day.isSame(startDate, 'day');
      case 'HEBDOMADAIRE':
        return day.isoWeekday() === startDate.isoWeekday();
      case 'MENSUELLE':
        return day.date() === startDate.date();
      default:
        return false;
    }
  }

  calculatePosition(seance: Seance): string {
    const start = moment(seance.horaireDebut, 'HH:mm');
    const minutesFromTop = (start.hours() - 8) * 60 + start.minutes();
    return `${minutesFromTop}px`;
  }

  calculateHeight(seance: Seance): string {
    const start = moment(seance.horaireDebut, 'HH:mm');
    const end = moment(seance.horaireFin, 'HH:mm');
    return `${end.diff(start, 'minutes')}px`;
  }

  toggleSeance(seance: Seance) {
    this.selectedSeance = this.selectedSeance?.id === seance.id ? null : seance;
  }

  getRecurrenceLabel(type: string): string {
    return {
      'AUCUNE': 'Ponctuelle',
      'HEBDOMADAIRE': 'Hebdomadaire',
      'MENSUELLE': 'Mensuelle'
    }[type] || 'Inconnue';
  }

  // Méthode pour changer l'ordre de tri
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
}
