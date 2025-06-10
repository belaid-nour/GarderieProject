// seance.routes.ts
import { Route } from '@angular/router';
import { SeanceListComponent } from './seance-list/seance-list.component';
import { SeanceFormComponent } from './seance-form/seance-form.component';
import { SeanceDetailsComponent } from './seance-details/seance-details.component';
import { TimetableComponent } from './seance-details-timetable/seance-details-timetable.component';


export const SEANCE_ROUTE: Route[] = [
  {
    path: 'all-seances',
    component: SeanceListComponent,
  },
   {
    path: 'timetable',
    component: TimetableComponent,
  },
  {
    path: 'add-seance',
    component: SeanceFormComponent,
  },

  {
  path: 'calendrier/:classId',
  component: SeanceDetailsComponent,
}

];
