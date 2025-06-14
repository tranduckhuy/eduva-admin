import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/layout/main-layout/main-layout.component').then(
        mod => mod.MainLayoutComponent
      ),
    children: [
      {
        path: 'schools',
        loadChildren: () =>
          import('./schools/schools.routes').then(mod => mod.schoolsRoute),
      },
      {
        path: 'school-admins',
        loadChildren: () =>
          import('./school-admins/school-admins.routes').then(
            mod => mod.schoolAdminsRoute
          ),
      },
      {
        path: 'teachers',
        loadChildren: () =>
          import('./teachers/teachers.routes').then(mod => mod.teachersRoute),
      },
      {
        path: 'students',
        loadChildren: () =>
          import('./students/students.routes').then(mod => mod.studentsRoute),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('../../core/layout/blank-layout/blank-layout.component').then(
        mod => mod.BlankLayoutComponent
      ),
    children: [],
  },
];
