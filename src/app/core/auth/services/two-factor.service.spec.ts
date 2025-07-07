import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { TwoFactorService } from './two-factor.service';
import { AuthService } from './auth.service';
import { UserService } from '../../../shared/services/api/user/user.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';

import {
  type RequestEnableDisable2FA,
  type ConfirmEnableDisable2FA,
} from '../../../shared/pages/settings-page/account-settings/models/toggle-2fa-request.model';
import { type VerifyOtpRequest } from '../models/request/verify-otp-request.model';
import { type AuthTokenResponse } from '../models/response/auth-response.model';
import {
  type ResendOtpRequest,
  ResendOtpPurpose,
} from '../models/request/resend-otp-request.model';

describe('TwoFactorService', () => {
  let service: TwoFactorService;
  let authService: any;
  let userService: any;
  let requestService: any;
  let toastHandlingService: any;

  const mockRequestEnableDisable2FA: RequestEnableDisable2FA = {
    currentPassword: 'currentPassword123',
  };

  const mockConfirmEnableDisable2FA: ConfirmEnableDisable2FA = {
    otpCode: '123456',
  };

  const mockVerifyOtpRequest: VerifyOtpRequest = {
    otpCode: '123456',
    email: 'test@example.com',
  };

  const mockResendOtpRequest: ResendOtpRequest = {
    email: 'test@example.com',
    purpose: ResendOtpPurpose.Login,
  };

  const mockAuthTokenResponse: AuthTokenResponse = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 3600,
    requires2FA: false,
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    authService = {
      handleLoginSuccess: vi.fn(),
    };
    userService = {
      updateCurrentUserPartial: vi.fn(),
    };
    requestService = {
      post: vi.fn(),
    };
    toastHandlingService = {
      success: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      errorGeneral: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TwoFactorService,
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastHandlingService },
      ],
    });

    service = TestBed.inject(TwoFactorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('requestEnableDisable2FA', () => {
    it('should handle successful request enable 2FA', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service
          .requestEnableDisable2FA(mockRequestEnableDisable2FA, true)
          .subscribe({
            next: () => {
              expect(requestService.post).toHaveBeenCalledWith(
                expect.stringContaining('/auth/security/request-disable-2fa'),
                mockRequestEnableDisable2FA,
                { bypassAuthError: true, loadingKey: 'password-modal' }
              );
              expect(toastHandlingService.success).toHaveBeenCalledWith(
                'Yêu cầu thành công',
                'Vui lòng kiểm tra hộp thư của bạn để xác nhận việc hủy xác thực hai bước.'
              );
              resolve();
            },
            error: err => {
              throw err;
            },
          });
      });
    });

    it('should handle successful request disable 2FA', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service
          .requestEnableDisable2FA(mockRequestEnableDisable2FA, false)
          .subscribe({
            next: () => {
              expect(requestService.post).toHaveBeenCalledWith(
                expect.stringContaining('/auth/security/request-enable-2fa'),
                mockRequestEnableDisable2FA,
                { bypassAuthError: true, loadingKey: 'password-modal' }
              );
              expect(toastHandlingService.success).toHaveBeenCalledWith(
                'Yêu cầu thành công',
                'Vui lòng kiểm tra hộp thư của bạn để xác nhận việc kích hoạt xác thực hai bước.'
              );
              resolve();
            },
            error: err => {
              throw err;
            },
          });
      });
    });

    it('should handle request 2FA with non-success status code', async () => {
      const mockResponse = { statusCode: 'ERROR' };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service
          .requestEnableDisable2FA(mockRequestEnableDisable2FA, true)
          .subscribe({
            next: () => {
              expect(toastHandlingService.error).toHaveBeenCalledWith(
                'Đã xảy ra lỗi',
                'Không thể gửi yêu cầu hủy xác thực hai bước. Vui lòng thử lại sau.'
              );
              resolve();
            },
            error: err => {
              throw err;
            },
          });
      });
    });

    it('should handle request 2FA error with INVALID_CREDENTIALS status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.INVALID_CREDENTIALS },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service
          .requestEnableDisable2FA(mockRequestEnableDisable2FA, true)
          .subscribe({
            next: () => {
              expect(toastHandlingService.warn).toHaveBeenCalledWith(
                'Cảnh báo xác thực',
                'Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra và thử lại.'
              );
              resolve();
            },
            error: err => {
              expect(err).toBe(errorResponse);
              resolve();
            },
          });
      });
    });

    it('should handle request 2FA error with general error', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: 'UNKNOWN_ERROR' },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service
          .requestEnableDisable2FA(mockRequestEnableDisable2FA, true)
          .subscribe({
            next: () => {
              expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
              resolve();
            },
            error: err => {
              expect(err).toBe(errorResponse);
              resolve();
            },
          });
      });
    });
  });

  describe('confirmEnableDisable2FA', () => {
    it('should handle successful confirm enable 2FA', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service
          .confirmEnableDisable2FA(mockConfirmEnableDisable2FA, true)
          .subscribe({
            next: () => {
              expect(requestService.post).toHaveBeenCalledWith(
                expect.stringContaining('/auth/security/confirm-disable-2fa'),
                mockConfirmEnableDisable2FA,
                { bypassAuthError: true, loadingKey: 'otp-modal' }
              );
              expect(toastHandlingService.success).toHaveBeenCalledWith(
                'Xác nhận thành công',
                'Xác thực hai bước đã được hủy thành công cho tài khoản của bạn.'
              );
              expect(userService.updateCurrentUserPartial).toHaveBeenCalledWith(
                { is2FAEnabled: false }
              );
              resolve();
            },
            error: err => {
              throw err;
            },
          });
      });
    });

    it('should handle successful confirm disable 2FA', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service
          .confirmEnableDisable2FA(mockConfirmEnableDisable2FA, false)
          .subscribe({
            next: () => {
              expect(requestService.post).toHaveBeenCalledWith(
                expect.stringContaining('/auth/security/confirm-enable-2fa'),
                mockConfirmEnableDisable2FA,
                { bypassAuthError: true, loadingKey: 'otp-modal' }
              );
              expect(toastHandlingService.success).toHaveBeenCalledWith(
                'Xác nhận thành công',
                'Xác thực hai bước đã được kích hoạt thành công cho tài khoản của bạn.'
              );
              expect(userService.updateCurrentUserPartial).toHaveBeenCalledWith(
                { is2FAEnabled: true }
              );
              resolve();
            },
            error: err => {
              throw err;
            },
          });
      });
    });

    it('should handle confirm 2FA with non-success status code', async () => {
      const mockResponse = { statusCode: 'ERROR' };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service
          .confirmEnableDisable2FA(mockConfirmEnableDisable2FA, true)
          .subscribe({
            next: () => {
              expect(toastHandlingService.error).toHaveBeenCalledWith(
                'Thất bại',
                'Không thể hủy xác thực hai bước. Vui lòng thử lại sau.'
              );
              resolve();
            },
            error: err => {
              throw err;
            },
          });
      });
    });

    it('should handle confirm 2FA error with OTP_INVALID_OR_EXPIRED status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.OTP_INVALID_OR_EXPIRED },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service
          .confirmEnableDisable2FA(mockConfirmEnableDisable2FA, true)
          .subscribe({
            next: () => {
              expect(toastHandlingService.error).toHaveBeenCalledWith(
                'Lỗi xác thực',
                'Mã xác minh không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại mã OTP.'
              );
              resolve();
            },
            error: err => {
              expect(err).toBe(errorResponse);
              resolve();
            },
          });
      });
    });
  });

  describe('verifyTwoFactor', () => {
    it('should handle successful verify 2FA and return auth data', async () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockAuthTokenResponse,
      };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.verifyTwoFactor(mockVerifyOtpRequest).subscribe({
          next: result => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/verify-otp-login'),
              mockVerifyOtpRequest,
              { bypassAuth: true, bypassAuthError: true }
            );
            expect(authService.handleLoginSuccess).toHaveBeenCalledWith(
              mockAuthTokenResponse
            );
            expect(result).toEqual(mockAuthTokenResponse);
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle verify 2FA with non-success status code', async () => {
      const mockResponse = { statusCode: 'ERROR' };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.verifyTwoFactor(mockVerifyOtpRequest).subscribe({
          next: result => {
            expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
            expect(result).toBeNull();
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle verify 2FA error with OTP_INVALID_OR_EXPIRED status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.OTP_INVALID_OR_EXPIRED },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.verifyTwoFactor(mockVerifyOtpRequest).subscribe({
          next: result => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Lỗi xác thực',
              'Mã xác minh không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại mã OTP.'
            );
            expect(result).toBeNull();
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle verify 2FA error with USER_NOT_EXISTS status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.USER_NOT_EXISTS },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.verifyTwoFactor(mockVerifyOtpRequest).subscribe({
          next: result => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Email không tồn tại',
              'Không tìm thấy tài khoản nào tương ứng với địa chỉ email của bạn.'
            );
            expect(result).toBeNull();
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });
  });

  describe('resendOtp', () => {
    it('should handle successful resend OTP', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.resendOtp(mockResendOtpRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/resend-otp'),
              mockResendOtpRequest
            );
            expect(toastHandlingService.success).toHaveBeenCalledWith(
              'Yêu cầu đã được xử lý',
              'Một mã xác minh gồm 6 chữ số đã được gửi tới địa chỉ email của bạn. Vui lòng kiểm tra hộp thư để tiếp tục.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle resend OTP with non-success status code', async () => {
      const mockResponse = { statusCode: 'ERROR' };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.resendOtp(mockResendOtpRequest).subscribe({
          next: () => {
            expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle resend OTP error with OTP_INVALID_OR_EXPIRED status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.OTP_INVALID_OR_EXPIRED },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.resendOtp(mockResendOtpRequest).subscribe({
          next: () => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Lỗi xác thực',
              'Mã xác minh không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại mã OTP.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle resend OTP error with USER_NOT_EXISTS status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.USER_NOT_EXISTS },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.resendOtp(mockResendOtpRequest).subscribe({
          next: () => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Email không tồn tại',
              'Không tìm thấy tài khoản nào tương ứng với địa chỉ email của bạn.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle resend OTP error with general error', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: 'UNKNOWN_ERROR' },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.resendOtp(mockResendOtpRequest).subscribe({
          next: () => {
            expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });
  });
});
