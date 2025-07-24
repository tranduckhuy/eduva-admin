import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { ConfirmationService } from 'primeng/api';

import { AuthService } from '../auth/services/auth.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import { BYPASS_AUTH_ERROR } from '../../shared/tokens/context/http-context.token';

let hasShownUnauthorizedDialog = false;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const globalModalService = inject(GlobalModalService);
  const confirmationService = inject(ConfirmationService);

  const isByPass = req.context.get(BYPASS_AUTH_ERROR);

  const handleServerError = () => router.navigateByUrl('/errors/500');

  const handleUnauthorized = () => {
    if (hasShownUnauthorizedDialog) return;

    hasShownUnauthorizedDialog = true;

    globalModalService.close();
    confirmationService.confirm({
      header: 'Phiên đã hết hạn',
      message: 'Vui lòng đăng nhập lại.',
      closable: false,
      rejectVisible: false,
      acceptButtonProps: { label: 'Đồng ý' },
      accept: () => {
        // ? Clear cookie and user profile cache
        authService.clearSession();

        // ? Clear state cache
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('accordion-open:')) {
            localStorage.removeItem(key);
          }
        });

        // ? Close modal
        globalModalService.close();

        // ? Close Submenus
        window.dispatchEvent(new Event('close-all-submenus'));

        router.navigateByUrl('/auth/login', { replaceUrl: true });
      },
    });
  };

  const handleForbidden = () => router.navigateByUrl('/errors/403');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthError = error.status === 401;
      const isForbidden = error.status === 403;
      const isServerError = error.status === 0 || error.status >= 500;

      if (isServerError) {
        handleServerError();
        return throwError(() => error);
      }

      if (isAuthError && !isByPass) {
        handleUnauthorized();
        return throwError(() => error);
      }

      if (isForbidden && !isByPass) {
        handleForbidden();
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
