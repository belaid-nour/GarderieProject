import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { NgIf, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeanceService } from '../seance-list/seance.service';
import { ClasseService } from '../seance-list/classe.service';
import { Seance, Classe } from '../seance-list/seance.model';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

@Component({
  selector: 'app-class-calendar',
  templateUrl: './seance-details.component.html',
  styleUrls: ['./seance-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    FullCalendarModule,
    DatePipe
  ],
  providers: [DatePipe, ClasseService]
})
export class SeanceDetailsComponent implements OnInit {
  classes: Classe[] = [];
  classId: number | null = null;
  selectedEvent: any = null;
  isLoading = true;

  private typeColors: { [key: string]: string } = {
    COURS: '#6366F1',
    TD: '#10B981',
    TP: '#EF4444',
    EXAMEN: '#F59E0B',
    REUNION: '#8B5CF6',
    DEFAULT: '#6366F1'
  };

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  seanceService = inject(SeanceService);
  classeService = inject(ClasseService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: 'fr',
    timeZone: 'local',
    eventClick: this.handleEventClick.bind(this),
    eventColor: '#64748B',
    eventBorderColor: '#000000',
    eventTextColor: '#FFFFFF'
  };

  ngOnInit(): void {
    this.loadClasses();
  }

  private loadClasses(): void {
    this.classeService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.isLoading = false;

        this.route.params.subscribe(params => {
          const routeClassId = +params['classId'];
          if (routeClassId && this.classes.some(c => c.id === routeClassId)) {
            this.classId = routeClassId;
          } else if (this.classes.length > 0) {
            this.classId = this.classes[0].id;
            this.router.navigate(['/calendrier', this.classId]);
          }
          this.loadSeances();
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement classes:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onClassChange(): void {
    if (this.classId) {
      this.router.navigate(['/calendrier', this.classId]);
      this.loadSeances();
    }
  }

  private loadSeances(): void {
    if (!this.classId) return;

    this.seanceService.getSeancesByClasse(this.classId).subscribe({
      next: (seances) => {
        const api = this.calendarComponent.getApi();
        api.removeAllEvents();
        api.addEventSource(this.generateRecurrentEvents(seances));
        api.refetchEvents();
        api.render();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  private generateRecurrentEvents(seances: Seance[]): EventInput[] {
    return seances.flatMap(seance => {
      if (!this.isValidSeance(seance)) return [];

      const baseEvent = this.createBaseEvent(seance);
      const recurrence = seance.recurrenceType.toUpperCase();

      return recurrence === 'AUCUNE'
        ? [baseEvent]
        : this.generateRecurrences(baseEvent, seance);
    });
  }

  private generateRecurrences(baseEvent: EventInput, seance: Seance): EventInput[] {
    const events = [];
    let currentDate = new Date(baseEvent.start as string);
    const endDate = this.getEndDate(seance);

    while (currentDate <= endDate) {
      const eventDate = new Date(currentDate.getTime());

      events.push({
        ...baseEvent,
        start: this.formatDate(eventDate, seance.horaireDebut),
        end: this.formatDate(eventDate, seance.horaireFin)
      });

      const nextDate = new Date(eventDate.getTime());

      switch(seance.recurrenceType.toUpperCase()) {
        case 'HEBDOMADAIRE':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'MENSUELLE':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
      }

      currentDate = nextDate;
    }

    return events;
  }

  private getEndDate(seance: Seance): Date {
    if (seance.endDate) {
      const endDateStr = this.convertToISODate(seance.endDate);
      return new Date(endDateStr + 'T23:59:59');
    }
    return new Date(new Date().setMonth(new Date().getMonth() + 3));
  }

  private isValidSeance(seance: Seance): boolean {
    return !!seance.startDate &&
           !!seance.horaireDebut &&
           !!seance.horaireFin &&
           this.isValidDate(seance.startDate) &&
           (!seance.endDate || this.isValidDate(seance.endDate));
  }

  private isValidDate(dateString: string): boolean {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(dateString);
  }

  private createBaseEvent(seance: Seance): EventInput {
    const startDate = this.convertToISODate(seance.startDate);
    return {
      id: seance.id.toString(),
      title: seance.nom,
      start: `${startDate}T${seance.horaireDebut}`,
      end: `${startDate}T${seance.horaireFin}`,
      extendedProps: {
        lieu: seance.lieu,
        enseignant: `${seance.enseignant.prenom} ${seance.enseignant.nom}`,
        recurrence: seance.recurrenceType
      }
    };
  }

  private convertToISODate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private formatDate(date: Date, time: string): string {
    const isoDate = date.toISOString().split('T')[0];
    return `${isoDate}T${time}`;
  }

  handleEventClick(clickInfo: EventClickArg): void {
    this.selectedEvent = {
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      extendedProps: {
        ...clickInfo.event.extendedProps,
        color: clickInfo.event.backgroundColor
      }
    };
  }

  closeModal(): void {
    this.selectedEvent = null;
  }
}
