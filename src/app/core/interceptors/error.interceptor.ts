import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { ConfirmationService } from 'primeng/api';

import { AuthService } from '../auth/services/auth.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import {
  BYPASS_AUTH_ERROR,
  BYPASS_NOT_FOUND_ERROR,
} from '../../shared/tokens/context/http-context.token';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const globalModalService = inject(GlobalModalService);
  const confirmationService = inject(ConfirmationService);

  const isByPassAuth = req.context.get(BYPASS_AUTH_ERROR);
  const isByPassNotFound = req.context.get(BYPASS_NOT_FOUND_ERROR);

  const handleServerError = () => router.navigateByUrl('/errors/500');

  const handleForbidden = () => router.navigateByUrl('/errors/403');

  const handleNotFound = () => router.navigateByUrl('/errors/404');

  const handleTooManyRequest = () => router.navigateByUrl('/errors/429');

  const handleUnauthorized = () => {
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

  const handleErrorByStatusCode = (error: HttpErrorResponse) => {
    const status = error.status;

    if (status === 0 || status >= 500) {
      handleServerError();
      return;
    }

    if (!isByPassAuth && (status === 401 || status === 403)) {
      if (status === 401) {
        handleUnauthorized();
      } else {
        handleForbidden();
      }
      return;
    }

    if (status === 404 && !isByPassNotFound) {
      handleNotFound();
      return;
    }

    if (status === 429) {
      handleTooManyRequest();
    }
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleErrorByStatusCode(error);
      return throwError(() => error);
    })
  );
};
