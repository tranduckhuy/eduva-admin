import { Routes } from '@angular/router';

export const schoolsRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./schools.component').then(mod => mod.SchoolsComponent),
    data: {
      heading: 'Danh sách trường học',
      breadcrumb: 'Danh sách trường học',
    },
  },
  {
    path: ':schoolId',
    loadComponent: () =>
      import('./school/school.component').then(mod => mod.SchoolComponent),
    data: {
      heading: 'Chi tiết trường học',
      breadcrumb: 'Chi tiết trường học',
    },
  },
];
