import { Route } from '@angular/router';
import { CourseListComponent  } from './course-list/course-list.component';
import { CourseFormComponent  } from './course-list/course-form.component';

import { CourseUploadComponent } from './course-upload/course-upload.component';

export const course_list_ROUTE: Route[] = [

{
  path: 'course-list', // ✅ Format correct avec paramètre
  component: CourseListComponent  // ✅ Composant d'évaluation
},
{
  path: 'course-upload', // ✅ Format correct avec paramètre
  component: CourseUploadComponent // ✅ Composant d'évaluation
},
{
  path: 'courses/edit/:id',
  component: CourseFormComponent
}


    ]
