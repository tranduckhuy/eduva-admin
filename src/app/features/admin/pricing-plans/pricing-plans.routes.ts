import { Routes } from '@angular/router';

export const pricingPlansRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pricing-plans.component').then(
        mod => mod.PricingPlansComponent
      ),
    data: {
      heading: 'Danh sách gói đăng ký',
      breadcrumb: 'Danh sách gói đăng ký',
    },
  },
  // {
  //   path: ':schoolId/update',
  //   loadComponent: () =>
  //     import('./edit-school-admin/edit-school-admin.component').then(
  //       mod => mod.EditSchoolAdminComponent
  //     ),
  //   data: {
  //     heading: 'Cập nhật gói đăng ký',
  //     breadcrumb: 'Cập nhật gói đăng ký',
  //   },
  // },
  {
    path: 'create',
    loadComponent: () =>
      import('./pricing-plan-create/pricing-plan-create.component').then(
        mod => mod.PricingPlanCreateComponent
      ),
    data: {
      heading: 'Tạo gói đăng ký',
      breadcrumb: 'Tạo gói đăng ký',
    },
  },
  {
    path: ':pricingPlanId',
    loadComponent: () =>
      import('./pricing-plan/pricing-plan.component').then(
        mod => mod.PricingPlanComponent
      ),
    data: {
      heading: 'Chi tiết pricing plan',
      breadcrumb: 'Chi tiết pricing plan',
    },
  },
];
