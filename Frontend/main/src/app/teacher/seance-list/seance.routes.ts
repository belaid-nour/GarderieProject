import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { TeacherSeanceListComponent  } from './seance-list.component';

export const PARENT_PROFIL_ROUTE: Route[] = [


      {
        path: 'mes-seances',
        component: TeacherSeanceListComponent
      }

    ]
