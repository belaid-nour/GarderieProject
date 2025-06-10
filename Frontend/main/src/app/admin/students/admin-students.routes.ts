import { Route } from '@angular/router';
import { AllStudentsComponent } from './all-students/all-students.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditEnfantDialogComponent } from './edit-student/edit-student.component';
import { AboutStudentComponent } from './about-student/about-student.component';
import { StudentAttendanceComponent } from './student-attendance/student-attendance.component';

export const ADMIN_STUDENT_ROUTE: Route[] = [
  {
    path: 'all-students',
    component: AllStudentsComponent,
  },
  {
    path: 'add-student',
    component: AddStudentComponent,
  },
  {
    path: 'edit-student',
    component: EditEnfantDialogComponent,
  },
  {
    path: 'about-student',
    component: AboutStudentComponent,
  },
  {
    path: 'student-attendance',
    component: StudentAttendanceComponent,
  }
];
