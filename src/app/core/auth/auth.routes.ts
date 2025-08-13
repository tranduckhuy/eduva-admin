import { Routes } from '@angular/router';

import { redirectAuthenticatedGuard } from '../guards/redirect-authenticated.guard';
import { requireQueryParamsGuard } from '../guards/required-params.guard';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../layout/blank-layout/blank-layout.component').then(
        mod => mod.BlankLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        data: {
          title: 'Đăng nhập',
        },
        canMatch: [redirectAuthenticatedGuard],
        loadComponent: () =>
          import('./pages/login/login.component').then(
            mod => mod.LoginComponent
          ),
      },
      {
        path: 'forgot-password',
        data: {
          title: 'Quên mật khẩu',
        },
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password.component').then(
            mod => mod.ForgotPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        data: {
          title: 'Đặt lại mật khẩu',
        },
        canActivate: [requireQueryParamsGuard(['token', 'email'])],
        loadComponent: () =>
          import('./pages/reset-password/reset-password.component').then(
            mod => mod.ResetPasswordComponent
          ),
      },
      {
        path: 'otp-confirmation',
        data: {
          title: 'Xác thực OTP',
        },
        canMatch: [
          redirectAuthenticatedGuard,
          requireQueryParamsGuard(['email']),
        ],
        loadComponent: () =>
          import('./pages/otp-confirmation/otp-confirmation.component').then(
            mod => mod.OtpConfirmationComponent
          ),
      },
    ],
  },
];
