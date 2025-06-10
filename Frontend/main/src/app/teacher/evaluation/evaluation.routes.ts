import { Route } from '@angular/router';
import { EvaluationListComponent } from './evaluation-list/evaluation-list.component';

export const evaluation_PROFIL_ROUTE: Route[] = [

{
  path: 'evaluation-list/:seanceId', // ✅ Format correct avec paramètre
  component: EvaluationListComponent // ✅ Composant d'évaluation
}

    ]
