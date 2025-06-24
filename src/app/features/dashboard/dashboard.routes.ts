import { Routes } from '@angular/router';

export const dashboardRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then(mod => mod.DashboardComponent),
    data: {
      heading: 'Dashboard',
      breadcrumb: 'Dashboard',
    },
  },
];
