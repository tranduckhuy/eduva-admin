import { Routes } from '@angular/router';

export const teacherRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/layout/main-layout/main-layout.component').then(
        mod => mod.MainLayoutComponent
      ),
    children: [],
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
