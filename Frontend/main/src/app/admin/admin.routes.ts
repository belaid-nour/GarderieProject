import { Route } from '@angular/router';
import { TeacherAvertissementsAdminComponent} from './teacher-avertissements/avertissement-list.component';
import { AbsencesAdminListComponent } from './list-absence/list-absence.component';
import { EvaluationListComponent } from './list-evaluartion/list-evaluation.component';
import { CalendarComponent } from './calendar/calendar.component';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
  },
   {
        path: 'avertissement-list-enfant',
        component: TeacherAvertissementsAdminComponent,
      },
      {
        path: 'calendar',
        component: CalendarComponent ,
      },
       {
        path: 'evaluation',
        component: EvaluationListComponent,
      },
       {
          path: 'list-absence',
          component: AbsencesAdminListComponent,
        },
         {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.routes').then(
        (m) => m.CHAT_ROUTE
      ),
  },
  {
    path: 'classe',
    loadChildren: () =>
      import('./classe/classe.routes').then((m) => m.ADMIN_CLASS_ROUTE),
  },
  {
    path: 'seances',
    loadChildren: () =>
      import('./seances/seance.routes').then((m) => m.SEANCE_ROUTE),
  },

  {
    path: 'teachers',
    loadChildren: () =>
      import('./teachers/admin-teachers.routes').then(
        (m) => m.ADMIN_TEACHER_ROUTE
      ),
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./students/admin-students.routes').then(
        (m) => m.ADMIN_STUDENT_ROUTE
      ),
  },
  {
    path: 'library',
    loadChildren: () =>
      import('./library/library.routes').then((m) => m.LIBRARY_ROUTE),
  },
  {
    path: 'parents',
    loadChildren: () =>
      import('./parents/admin-parents.routes').then((m) => m.ADMIN_PARENT_ROUTE)
      ,
  },




];
