import { Routes } from '@angular/router';

export const pricingPlansRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pricing-plans.component').then(
        mod => mod.PricingPlansComponent
      ),
    data: {
      heading: 'Danh sách pricing plans',
      breadcrumb: 'Danh sách pricing plans',
    },
  },
  // {
  //   path: ':schoolId/update',
  //   loadComponent: () =>
  //     import('./edit-school-admin/edit-school-admin.component').then(
  //       mod => mod.EditSchoolAdminComponent
  //     ),
  //   data: {
  //     heading: 'Cập nhật pricing plans',
  //     breadcrumb: 'Cập nhật pricing plans',
  //   },
  // },
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
