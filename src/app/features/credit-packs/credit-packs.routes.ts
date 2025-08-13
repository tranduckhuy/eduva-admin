import { Routes } from '@angular/router';

export const creditPacksRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./credit-packs.component').then(mod => mod.CreditPacksComponent),
    data: {
      title: 'Danh sách gói credit',
      heading: 'Danh sách gói credit',
      breadcrumb: 'Danh sách gói credit',
    },
  },
  {
    path: ':creditPackId/update',
    loadComponent: () =>
      import('./edit-credit-pack/edit-credit-pack.component').then(
        mod => mod.EditCreditPackComponent
      ),
    data: {
      title: 'Cập nhật gói credit',
      heading: 'Cập nhật gói credit',
      breadcrumb: 'Cập nhật gói credit',
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-credit-pack/create-credit-pack.component').then(
        mod => mod.CreateCreditPackComponent
      ),
    data: {
      title: 'Tạo mới gói credit',
      heading: 'Tạo gói credit',
      breadcrumb: 'Tạo gói credit',
    },
  },
  {
    path: ':creditPackId',
    loadComponent: () =>
      import('./credit-pack/credit-pack.component').then(
        mod => mod.CreditPackComponent
      ),
    data: {
      title: 'Chi tiết gói credit',
      heading: 'Chi tiết gói credit',
      breadcrumb: 'Chi tiết gói credit',
    },
  },
];
