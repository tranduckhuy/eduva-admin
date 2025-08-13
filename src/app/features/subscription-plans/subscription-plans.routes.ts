import { Routes } from '@angular/router';

export const subscriptionPlansRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./subscription-plans.component').then(
        mod => mod.SubscriptionPlansComponent
      ),
    data: {
      title: 'Danh sách gói đăng ký',
      heading: 'Danh sách gói đăng ký',
      breadcrumb: 'Danh sách gói đăng ký',
    },
  },
  {
    path: ':subscriptionPlanId/update',
    loadComponent: () =>
      import('./edit-subscription-plan/edit-subscription-plan.component').then(
        mod => mod.EditSubscriptionPlanComponent
      ),
    data: {
      title: 'Cập nhật gói đăng ký',
      heading: 'Cập nhật gói đăng ký',
      breadcrumb: 'Cập nhật gói đăng ký',
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './subscription-plan-create/subscription-plan-create.component'
      ).then(mod => mod.SubscriptionPlanCreateComponent),
    data: {
      title: 'Tạo mới gói đăng ký',
      heading: 'Tạo gói đăng ký',
      breadcrumb: 'Tạo gói đăng ký',
    },
  },
  {
    path: ':subscriptionPlanId',
    loadComponent: () =>
      import('./subscription-plan/subscription-plan.component').then(
        mod => mod.SubscriptionPlanComponent
      ),
    data: {
      title: 'Chi tiết gói đăng ký',
      heading: 'Chi tiết gói đăng ký',
      breadcrumb: 'Chi tiết gói đăng ký',
    },
  },
];
