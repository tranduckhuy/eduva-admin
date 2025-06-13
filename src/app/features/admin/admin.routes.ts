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
        loadComponent: () =>
          import('./schools/schools.component').then(
            mod => mod.SchoolsComponent
          ),
        data: {
          heading: 'Danh sách trường học',
          breadcrumb: 'Danh sách trường học',
        },
      },
      {
        path: 'schools/:schoolId/update',
        loadComponent: () =>
          import('./schools/edit-school/edit-school.component').then(
            mod => mod.EditSchoolComponent
          ),
        data: {
          heading: 'Cập nhật trường học',
          breadcrumb: 'Cập nhật trường học',
        },
      },
      {
        path: 'schools/:schoolId',
        loadComponent: () =>
          import('./schools/school/school.component').then(
            mod => mod.SchoolComponent
          ),
        data: {
          heading: 'Chi tiết trường học',
          breadcrumb: 'Chi tiết trường học',
        },
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
