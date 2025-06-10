import { Route } from '@angular/router';
import { ClasseListComponent } from './classe-list/classe-list.component';
import { ClasseListEnfantComponent } from './classe-list-enfant/classe-list-enfant.component';
import { ClasseFormComponent } from './classe-form/classe-form.component';
import { ClasseAssignComponent } from './classe-details/classe-details.component';
import { EditClasseComponent } from './classe-form-edit/edit-classe.component'; // Ajout de l'import d'édition

export const ADMIN_CLASS_ROUTE: Route[] = [
  {
    path: 'nouveau',
    component: ClasseFormComponent,
  },
  {
    path: 'editer/:id', // Nouvelle route d'édition avec paramètre ID
    component: EditClasseComponent,
  },
  {
    path: 'assign',
    component: ClasseAssignComponent,
  },
  {
    path: 'list-classe-enfant',
    component: ClasseListEnfantComponent,
  },
  {
    path: 'list-class',
    component: ClasseListComponent,
  }
];
