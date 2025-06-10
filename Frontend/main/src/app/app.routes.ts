import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
import { Role } from '@core';
import { PageGardeComponent } from './page-garde/page-garde.component'; // Assure-toi du chemin correct

export const APP_ROUTE: Route[] = [
  // La page garde est la première accessible à la racine
  {
    path: '',
    component: PageGardeComponent,
    pathMatch: 'full',
  },

  // Toutes les autres routes protégées par AuthGuard sous MainLayout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // plus de redirection ici, la racine est déjà prise par garde

      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: {
          role: Role.Admin,
        },
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.ADMIN_ROUTE),
      },
      {
        path: 'teacher',
        canActivate: [AuthGuard],
        data: {
          role: Role.Teacher,
        },
        loadChildren: () =>
          import('./teacher/teacher.routes').then((m) => m.TEACHER_ROUTE),
      },
      {
        path: 'student',
        canActivate: [AuthGuard],
        data: {
          role: Role.Parent,
        },
        loadChildren: () =>
          import('./student/student.routes').then((m) => m.STUDENT_ROUTE),
      },
    ]
  },

  // Auth routes
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () => import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },

  // Page 404
  { path: '**', component: Page404Component }
];
