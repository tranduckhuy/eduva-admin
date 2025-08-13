import { Routes } from '@angular/router';

export const systemConfigRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./system-config.component').then(
        mod => mod.SystemConfigComponent
      ),
    data: {
      title: 'Cấu hình hệ thống',
      heading: 'Cấu hình hệ thống',
      breadcrumb: 'Cấu hình hệ thống',
    },
  },
];
