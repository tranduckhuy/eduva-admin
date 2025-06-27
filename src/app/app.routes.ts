import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { UserRoles } from './shared/constants/user-roles.constant';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then(mod => mod.authRoutes),
  },
  {
    path: 'admin',
    canMatch: [authGuard, roleGuard],
    data: {
      roles: [UserRoles.SYSTEM_ADMIN],
    },
    loadChildren: () =>
      import('./features/admin.routes').then(mod => mod.adminRoutes),
  },
  { path: '**', redirectTo: '' },
];
