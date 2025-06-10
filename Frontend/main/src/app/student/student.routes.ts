import { Route } from '@angular/router';
import { Page404Component } from '../authentication/page404/page404.component';
import { AbsenceListComponent } from './list-absence/list-absence.component';

import { TimetableComponent } from './seance-details-timetable/seance-details-timetable.component';

import { CourseListComponent } from './list-cours/list-cour.component';
import { EvaluationListComponent} from './list-evaluartion/list-evaluation.component';
import { AvertissementListComponent} from './teacher-avertissements/avertissement-list.component';

import { CalendarComponent} from './calendar/calendar.component';

import { SettingsComponent } from './settings/settings.component';

export const STUDENT_ROUTE: Route[] = [

    {
    path: 'evaluation',
    component: EvaluationListComponent,
  },
   {
      path: 'avertissement-list-enfant',
      component: AvertissementListComponent,
    },
     {
      path: 'calendrier',
      component: CalendarComponent,
    },
   {
    path: 'list-cours',
    component: CourseListComponent,
  },
  {
    path: 'list-absence',
    component: AbsenceListComponent,
  },
   {
    path: 'timetable',
    component: TimetableComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./chat/chat.routes').then(
        (m) => m.CHAT_ROUTES // Changé de CHAT_ROUTE à CHAT_ROUTES
      ),
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./students/student-students.routes').then(
        (m) => m.STUDENT_STUDENT_ROUTE
      ),
  }, {
    path: 'my-profil',
    loadChildren: () =>
      import('./my-profil/parent.route').then(
        (m) => m.PARENT_PROFIL_ROUTE
      ),
  },
  // La route wildcard (**) doit être placée en dernier
  { path: '**', component: Page404Component }
];
