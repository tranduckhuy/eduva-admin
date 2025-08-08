import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../core/layout/main-layout/main-layout.component').then(
        mod => mod.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            mod => mod.DashboardComponent
          ),
      },
      {
        path: 'schools',
        loadChildren: () =>
          import('./schools/schools.routes').then(mod => mod.schoolsRoute),
      },
      {
        path: 'school-admins',
        loadChildren: () =>
          import('./school-admins/school-admins.routes').then(
            mod => mod.schoolAdminsRoute
          ),
      },
      {
        path: 'teachers',
        loadChildren: () =>
          import('./teachers/teachers.routes').then(mod => mod.teachersRoute),
      },
      {
        path: 'students',
        loadChildren: () =>
          import('./students/students.routes').then(mod => mod.studentsRoute),
      },
      {
        path: 'content-moderators',
        loadChildren: () =>
          import('./content-moderators/content-moderators.routes').then(
            mod => mod.contentModeratorsRoute
          ),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./payments/payment.routes').then(mod => mod.paymentRoute),
      },
      {
        path: 'subscription-plans',
        loadChildren: () =>
          import('./subscription-plans/subscription-plans.routes').then(
            mod => mod.subscriptionPlansRoute
          ),
      },
      {
        path: 'credit-packs',
        loadChildren: () =>
          import('./credit-packs/credit-packs.routes').then(
            mod => mod.creditPacksRoute
          ),
      },
      {
        path: 'settings',
        data: {
          breadcrumb: 'Cài đặt',
        },
        loadComponent: () =>
          import(
            '../shared/pages/settings-page/settings-page-layout/settings-page-layout.component'
          ).then(mod => mod.SettingsPageLayoutComponent),
        loadChildren: () =>
          import('../shared/pages/settings-page/settings-page.routes').then(
            mod => mod.settingRoutes
          ),
      },
      {
        path: 'system-config',
        loadChildren: () =>
          import('./system-config/system-config.routes').then(
            mod => mod.systemConfigRoute
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('../core/layout/blank-layout/blank-layout.component').then(
        mod => mod.BlankLayoutComponent
      ),
    children: [],
  },
];
