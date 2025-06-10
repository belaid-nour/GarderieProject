import { Route } from '@angular/router';
import { AbsenceListComponent} from './absence-list.component';




export const ABSENCE_CLASS_ROUTE: Route[] = [

  {
    path: 'absence-list/:seanceId',
    component: AbsenceListComponent,
  }
];
