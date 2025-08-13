import { Routes } from '@angular/router';

export const studentsRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./students.component').then(mod => mod.StudentsComponent),
    data: {
      title: 'Danh sách học sinh',
      heading: 'Danh sách học sinh',
      breadcrumb: 'Danh sách học sinh',
    },
  },
  {
    path: ':studentId',
    loadComponent: () =>
      import('./student/student.component').then(mod => mod.StudentComponent),
    data: {
      title: 'Chi tiết học sinh',
      heading: 'Chi tiết học sinh',
      breadcrumb: 'Chi tiết học sinh',
    },
  },
];
