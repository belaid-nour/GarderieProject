import { Route } from '@angular/router';
import { AllParentsComponent } from './all-parents/all-parents.component';
import { AddParentComponent } from './add-parent/add-parent.component';
import { EditParentComponent } from './edit-parent/edit-parent.component';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const ADMIN_PARENT_ROUTE: Route[] = [
  {
    path: 'all-parents',
    component: AllParentsComponent,
  },
  {
    path: 'add-parent',
    component: AddParentComponent,
  },

  {
    path: 'edit-parent/:id',
    component: EditParentComponent,
  },
  {
    path: '**',
    component: Page404Component,
  }
];
