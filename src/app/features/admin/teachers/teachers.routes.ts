import { Routes } from '@angular/router';

export const teachersRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./teachers.component').then(mod => mod.TeachersComponent),
    data: {
      heading: 'Danh sách giáo viên',
      breadcrumb: 'Danh sách giáo viên',
    },
  },
  // {
  //   path: ':schoolId/update',
  //   loadComponent: () =>
  //     import('./edit-school/edit-school.component').then(
  //       mod => mod.EditSchoolComponent
  //     ),
  //   data: {
  //     heading: 'Cập nhật trường học',
  //     breadcrumb: 'Cập nhật trường học',
  //   },
  // },
  // {
  //   path: ':schoolId',
  //   loadComponent: () =>
  //     import('./school/school.component').then(mod => mod.SchoolComponent),
  //   data: {
  //     heading: 'Chi tiết trường học',
  //     breadcrumb: 'Chi tiết trường học',
  //   },
  // },
];
