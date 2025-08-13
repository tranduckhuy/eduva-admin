import { Routes } from '@angular/router';

export const schoolAdminsRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./school-admins.component').then(
        mod => mod.SchoolAdminsComponent
      ),
    data: {
      title: 'Danh sách quản lý trường học',
      heading: 'Danh sách quản lý trường học',
      breadcrumb: 'Danh sách quản lý trường học',
    },
  },
  {
    path: ':schoolAdminId',
    loadComponent: () =>
      import('./school-admin/school-admin.component').then(
        mod => mod.SchoolAdminComponent
      ),
    data: {
      title: 'Chi tiết quản lý trường học',
      heading: 'Chi tiết quản lý trường học',
      breadcrumb: 'Chi tiết quản lý trường học',
    },
  },
];
