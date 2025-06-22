import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/admin.routes').then(mod => mod.adminRoutes),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then(mod => mod.authRoutes),
  },
];
