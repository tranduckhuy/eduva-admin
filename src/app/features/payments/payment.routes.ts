import { Routes } from '@angular/router';

export const paymentRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./payments.component').then(mod => mod.PaymentsComponent),
    data: {
      title: 'Lịch sử thanh toán',
      heading: 'Lịch sử thanh toán',
      breadcrumb: 'Lịch sử thanh toán',
    },
  },
  {
    path: 'credit-pack/:paymentId',
    loadComponent: () =>
      import('./payment/payment.component').then(mod => mod.PaymentComponent),
    data: {
      title: 'Chi tiết thanh toán',
      heading: 'Chi tiết thanh toán',
      breadcrumb: 'Chi tiết thanh toán',
    },
  },
  {
    path: 'subscription-plan/:paymentId',
    loadComponent: () =>
      import('./payment/payment.component').then(mod => mod.PaymentComponent),
    data: {
      title: 'Chi tiết thanh toán',
      heading: 'Chi tiết thanh toán',
      breadcrumb: 'Chi tiết thanh toán',
    },
  },
];
