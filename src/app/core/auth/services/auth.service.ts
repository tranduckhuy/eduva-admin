import { Injectable, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { JwtService } from './jwt.service';
import { UserService } from '../../../shared/services/api/user/user.service';
import { EmailVerificationService } from './email-verification.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { GlobalModalService } from '../../../shared/services/layout/global-modal/global-modal.service';

import { StatusCode } from '../../../shared/constants/status-code.constant';
import { UserRoles } from '../../../shared/constants/user-roles.constant';

import { type LoginRequest } from '../pages/login/models/login-request.model';
import { type RefreshTokenRequest } from '../models/request/refresh-token-request.model';
import { type AuthTokenResponse } from '../models/response/auth-response.model';
import { type EmailLinkRequest } from '../models/request/email-link-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly jwtService = inject(JwtService);
  private readonly userService = inject(UserService);
  private readonly emailVerificationService = inject(EmailVerificationService);
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);
  private readonly globalModalService = inject(GlobalModalService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly LOGIN_API_URL = `${this.BASE_API_URL}/auth/login`;
  private readonly REFRESH_TOKEN_API_URL = `${this.BASE_API_URL}/auth/refresh-token`;
  private readonly LOGOUT_API_URL = `${this.BASE_API_URL}/auth/logout`;

  private readonly CLIENT_URL = `${environment.clientUrl}/auth/login`;

  private readonly isLoggedInSignal = signal<boolean>(
    !!this.jwtService.getAccessToken()
  );
  isLoggedIn = this.isLoggedInSignal.asReadonly();

  login(request: LoginRequest): Observable<AuthTokenResponse | null> {
    return this.requestService
      .post<AuthTokenResponse>(this.LOGIN_API_URL, request, {
        bypassAuth: true,
        bypassAuthError: true,
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            this.handleLoginSuccess(res.data);
            return res.data;
          }

          this.toastHandlingService.errorGeneral();
          return null;
        }),
        catchError(err => {
          this.handleLoginError(err, request.email);
          return of(null);
        })
      );
  }

  refreshToken(
    request: RefreshTokenRequest
  ): Observable<AuthTokenResponse | null> {
    return this.requestService
      .post<AuthTokenResponse>(this.REFRESH_TOKEN_API_URL, request, {
        bypassAuth: true,
        bypassAuthError: true,
        showLoading: false,
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            this.handleTokenStorage(res.data);
            return res.data;
          }

          this.clearSession();
          return null;
        }),
        catchError(() => {
          this.clearSession();
          this.router.navigateByUrl('/auth/login');
          return of(null);
        })
      );
  }

  logout(): Observable<void> {
    return this.requestService
      .post(this.LOGOUT_API_URL, undefined, { bypassAuthError: true })
      .pipe(
        tap(() => {
          // ? Clear user profile cache
          this.clearSession();

          // ? Clear state cache
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('accordion-open:')) {
              localStorage.removeItem(key);
            }
          });

          // ? Close modal
          this.globalModalService.close();

          // ? Close Submenus
          window.dispatchEvent(new Event('close-all-submenus'));

          this.router.navigateByUrl('/auth/login', { replaceUrl: true });
        }),
        map(() => void 0),
        catchError(() => of(void 0))
      );
  }

  handleLoginSuccess(data: AuthTokenResponse): void {
    this.handleTokenStorage(data);
    this.redirectUserAfterLogin();
  }

  // ---------------------------
  //  Private Helper Functions
  // ---------------------------

  private handleTokenStorage(data: AuthTokenResponse): void {
    const { accessToken, refreshToken, expiresIn } = data;
    this.jwtService.setAccessToken(accessToken);
    this.jwtService.setRefreshToken(refreshToken);
    this.jwtService.setExpiresDate(
      new Date(Date.now() + expiresIn * 1000).toISOString()
    );
  }

  private redirectUserAfterLogin(): void {
    this.userService.getCurrentProfile().subscribe(user => {
      if (!user) {
        this.toastHandlingService.errorGeneral();
        return;
      }

      if (!user.roles.includes(UserRoles.SYSTEM_ADMIN)) {
        this.router.navigateByUrl('/errors/403');
        setTimeout(() => {
          this.clearSession();
          this.isLoggedInSignal.set(false);
        }, 300);
        return;
      }

      this.isLoggedInSignal.set(true);
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

  private handleLoginError(err: HttpErrorResponse, email: string): void {
    const statusCode = err.error?.statusCode;

    switch (statusCode) {
      case StatusCode.USER_NOT_EXISTS:
      case StatusCode.INVALID_CREDENTIALS:
        this.toastHandlingService.error(
          'Đăng nhập thất bại',
          'Tên đăng nhập hoặc mật khẩu chưa chính xác.'
        );
        break;

      case StatusCode.USER_NOT_CONFIRMED:
        this.toastHandlingService.error(
          'Đăng nhập thất bại',
          'Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để hoàn tất xác minh.'
        );
        this.resendConfirmEmail(email);
        break;

      case StatusCode.USER_ACCOUNT_LOCKED:
        this.toastHandlingService.error(
          'Đăng nhập thất bại',
          'Tài khoản của bạn đã bị vô hiệu hóa.'
        );
        break;

      case StatusCode.REQUIRES_OTP_VERIFICATION:
        this.router.navigate(['/auth/otp-confirmation'], {
          queryParams: { email },
        });
        break;

      default:
        this.toastHandlingService.errorGeneral();
    }
  }

  private resendConfirmEmail(email: string): void {
    const request: EmailLinkRequest = {
      email,
      clientUrl: this.CLIENT_URL,
    };

    this.emailVerificationService
      .resendConfirmEmail(request, {
        title: 'Email xác minh đã được gửi lại',
        description: 'Vui lòng kiểm tra email của bạn để hoàn tất xác minh.',
      })
      .subscribe();
  }

  private clearSession(): void {
    this.jwtService.clearAll();
    this.userService.clearCurrentUser();
    this.isLoggedInSignal.set(false);
  }
}
