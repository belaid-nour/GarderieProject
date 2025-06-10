
import { LecturesComponent } from './lectures/lectures.component';
import { Page404Component } from '../authentication/page404/page404.component';
import { Route } from '@angular/router';
import { AvertissementFormComponent } from './avertissement/avertissement.component';
import { TeacherAvertissementsComponent} from './teacher-avertissements/avertissement-list.component';


import { SettingsComponent } from './settings/settings.component';


export const TEACHER_ROUTE: Route[] = [

  {
    path: 'avertissement-list',
    component: TeacherAvertissementsComponent,
  },
  {
    path: 'lectures',
    component: LecturesComponent,
  },
  {
    path: 'avertissement',
    component: AvertissementFormComponent,
  },
    {
    path: 'absence',
    loadChildren: () =>
      import('./absence-list/absence.routes').then((m) => m.ABSENCE_CLASS_ROUTE),
  },  {
    path: 'course',
    loadChildren: () =>
      import('./course/course.routes').then((m) => m.course_list_ROUTE),
  },
    {
    path: 'evaluation',
    loadChildren: () =>
      import('./evaluation/evaluation.routes').then((m) => m.evaluation_PROFIL_ROUTE,),
  },
   {
    path: 'seances',
    loadChildren: () =>
      import('./seance-list/seance.routes').then((m) => m.PARENT_PROFIL_ROUTE),
  },
  {
    path: 'my-profil',
    loadChildren: () =>
      import('./my-profil/Teacher.route').then(
        (m) => m.PARENT_PROFIL_ROUTE
      ),
  },


  {
    path: 'settings',
    component: SettingsComponent,
  },
  { path: '**', component: Page404Component },
];
