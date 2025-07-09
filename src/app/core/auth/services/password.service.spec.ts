import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { PasswordService } from './password.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';

import { type EmailLinkRequest } from '../models/request/email-link-request.model';
import { type ResetPasswordRequest } from '../pages/reset-password/models/reset-password-request.model';
import { type ChangePasswordRequest } from '../../../shared/models/api/request/command/change-password-request.model';

describe('PasswordService', () => {
  let service: PasswordService;
  let requestService: any;
  let toastHandlingService: any;

  const mockEmailLinkRequest: EmailLinkRequest = {
    email: 'test@example.com',
    clientUrl: 'http://localhost/auth/reset-password',
  };

  const mockResetPasswordRequest: ResetPasswordRequest = {
    email: 'test@example.com',
    token: 'test-token',
    password: 'newPassword123',
    confirmPassword: 'newPassword123',
  };

  const mockChangePasswordRequest: ChangePasswordRequest = {
    currentPassword: 'currentPassword123',
    newPassword: 'newPassword123',
    confirmPassword: 'newPassword123',
    logoutBehavior: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();

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
        PasswordService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastHandlingService },
      ],
    });

    service = TestBed.inject(PasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('forgotPassword', () => {
    it('should handle successful forgot password request', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.forgotPassword(mockEmailLinkRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/forgot-password'),
              {
                ...mockEmailLinkRequest,
                clientUrl: expect.stringContaining('/auth/reset-password'),
              }
            );
            expect(toastHandlingService.success).toHaveBeenCalledWith(
              'Thành công',
              'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến hoặc thư rác.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle forgot password request with non-success status code', async () => {
      const mockResponse = { statusCode: 'ERROR' };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.forgotPassword(mockEmailLinkRequest).subscribe({
          next: () => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Không thể gửi yêu cầu',
              'Có lỗi xảy ra khi gửi liên kết đặt lại mật khẩu. Vui lòng thử lại sau.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle forgot password error with USER_NOT_EXISTS status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.USER_NOT_EXISTS },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.forgotPassword(mockEmailLinkRequest).subscribe({
          next: () => {
            expect(toastHandlingService.warn).toHaveBeenCalledWith(
              'Email không tồn tại',
              'Vui lòng kiểm tra lại địa chỉ email.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle forgot password error with general error', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: 'UNKNOWN_ERROR' },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.forgotPassword(mockEmailLinkRequest).subscribe({
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

  describe('resetPassword', () => {
    it('should handle successful reset password request', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/reset-password'),
              mockResetPasswordRequest
            );
            expect(toastHandlingService.success).toHaveBeenCalledWith(
              'Thành công',
              'Mật khẩu của bạn đã được đặt lại.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle reset password error with INVALID_TOKEN status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.INVALID_TOKEN },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Liên kết hết hạn',
              'Vui lòng gửi lại yêu cầu đặt lại mật khẩu mới.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle reset password error with NEW_PASSWORD_SAME_AS_OLD status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.NEW_PASSWORD_SAME_AS_OLD },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => {
            expect(toastHandlingService.warn).toHaveBeenCalledWith(
              'Cảnh báo',
              'Mật khẩu mới không được trùng với mật khẩu hiện tại.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle reset password error with general error', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: 'UNKNOWN_ERROR' },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
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

  describe('changePassword', () => {
    it('should handle successful change password request', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/change-password'),
              mockChangePasswordRequest,
              { loadingKey: 'change-password-form' }
            );
            expect(toastHandlingService.success).toHaveBeenCalledWith(
              'Thành công',
              'Mật khẩu của bạn đã được đặt lại.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle change password request with non-success status code', async () => {
      const mockResponse = { statusCode: 'ERROR' };
      requestService.post.mockReturnValue(of(mockResponse));

      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
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

    it('should handle change password error with PROVIDED_INFORMATION_IS_INVALID status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.PROVIDED_INFORMATION_IS_INVALID },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
          next: () => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Lỗi xác thực',
              'Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra và thử lại.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle change password error with NEW_PASSWORD_SAME_AS_OLD status', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: StatusCode.NEW_PASSWORD_SAME_AS_OLD },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
          next: () => {
            expect(toastHandlingService.warn).toHaveBeenCalledWith(
              'Cảnh báo',
              'Mật khẩu mới không được trùng với mật khẩu hiện tại.'
            );
            resolve();
          },
          error: err => {
            throw err;
          },
        });
      });
    });

    it('should handle change password error with general error', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { statusCode: 'UNKNOWN_ERROR' },
      });
      requestService.post.mockReturnValue(throwError(() => errorResponse));

      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
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
