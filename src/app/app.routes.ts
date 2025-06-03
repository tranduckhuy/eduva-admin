import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then(mod => mod.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(mod => mod.adminRoutes),
  },
  {
    path: 'school-admin',
    loadChildren: () =>
      import('./features/school-admin/school-admin.routes').then(
        mod => mod.schoolAdminRoutes
      ),
  },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./features/teacher/teacher.routes').then(
        mod => mod.teacherRoutes
      ),
  },
];
