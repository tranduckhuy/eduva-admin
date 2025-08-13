import { Routes } from '@angular/router';

export const teachersRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./teachers.component').then(mod => mod.TeachersComponent),
    data: {
      title: 'Danh sách giáo viên',
      heading: 'Danh sách giáo viên',
      breadcrumb: 'Danh sách giáo viên',
    },
  },
  {
    path: ':teacherId',
    loadComponent: () =>
      import('./teacher/teacher.component').then(mod => mod.TeacherComponent),
    data: {
      title: 'Chi tiết giáo viên',
      heading: 'Chi tiết giáo viên',
      breadcrumb: 'Chi tiết giáo viên',
    },
  },
];
