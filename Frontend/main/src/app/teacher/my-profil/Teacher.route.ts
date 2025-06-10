import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { MonProfilComponent } from './my-profil.component';
import { EditProfilComponent } from './edit-profil/edit-profil.component';

export const PARENT_PROFIL_ROUTE: Route[] = [


      {
        path: 'mon-profil',
        component: MonProfilComponent
      },
      {
        path: 'edit-profil',
        component: EditProfilComponent
      },
      {
        path: '**',
        component: Page404Component
      }
    ]
