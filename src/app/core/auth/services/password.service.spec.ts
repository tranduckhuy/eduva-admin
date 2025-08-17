import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { PasswordService } from './password.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { type EmailLinkRequest } from '../models/request/email-link-request.model';
import { type ResetPasswordRequest } from '../pages/reset-password/models/reset-password-request.model';
import { type ChangePasswordRequest } from '../../../shared/models/api/request/command/change-password-request.model';

describe('PasswordService', () => {
  let service: PasswordService;
  let requestService: RequestService;
  let toastHandlingService: ToastHandlingService;

  const mockEmailLinkRequest: EmailLinkRequest = {
    email: 'test@example.com',
    clientUrl: 'http://localhost:4200/auth/reset-password',
  };
  const mockResetPasswordRequest: ResetPasswordRequest = {
    email: 'test@example.com',
    password: 'newPassword123',
    confirmPassword: 'newPassword123',
    token: 'reset-token',
  };
  const mockChangePasswordRequest: ChangePasswordRequest = {
    currentPassword: 'oldPass',
    newPassword: 'newPass',
    confirmPassword: 'newPass',
    logoutBehavior: 0,
  };

  beforeEach(() => {
    requestService = {
      post: vi.fn(),
    } as any;
    toastHandlingService = {
      success: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      errorGeneral: vi.fn(),
    } as any;
    TestBed.configureTestingModule({
      providers: [
        PasswordService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastHandlingService },
      ],
    });
    service = TestBed.inject(PasswordService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('forgotPassword', () => {
    it('should handle successful forgot password', async () => {
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS })
      );
      await new Promise<void>(resolve => {
        service.forgotPassword(mockEmailLinkRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/forgot-password'),
              expect.objectContaining({
                email: mockEmailLinkRequest.email,
                clientUrl: expect.any(String),
              })
            );
            expect(toastHandlingService.success).toHaveBeenCalledWith(
              'Thành công',
              expect.stringContaining('Liên kết đặt lại mật khẩu')
            );
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
    it('should handle forgot password error (user not exists)', async () => {
      const error = new HttpErrorResponse({
        error: { statusCode: StatusCode.USER_NOT_EXISTS },
      });
      (requestService.post as any).mockReturnValue(throwError(() => error));
      await new Promise<void>(resolve => {
        service.forgotPassword(mockEmailLinkRequest).subscribe({
          next: () => resolve(),
          error: () => {
            expect(toastHandlingService.warn).toHaveBeenCalledWith(
              'Email không tồn tại',
              'Vui lòng kiểm tra lại địa chỉ email.'
            );
            resolve();
          },
          complete: () => resolve(),
        });
      });
    });
    it('should handle forgot password error (general)', async () => {
      const error = new HttpErrorResponse({ error: { statusCode: 9999 } });
      (requestService.post as any).mockReturnValue(throwError(() => error));
      await new Promise<void>(resolve => {
        service.forgotPassword(mockEmailLinkRequest).subscribe({
          next: () => resolve(),
          error: () => {
            expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
            resolve();
          },
          complete: () => resolve(),
        });
      });
    });
    it('should handle forgot password response with error', async () => {
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SYSTEM_ERROR })
      );
      await new Promise<void>(resolve => {
        service.forgotPassword(mockEmailLinkRequest).subscribe({
          next: () => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Không thể gửi yêu cầu',
              expect.stringContaining('Có lỗi xảy ra khi gửi liên kết')
            );
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
  });

  describe('resetPassword', () => {
    it('should handle successful reset password', async () => {
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS })
      );
      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/reset-password'),
              mockResetPasswordRequest,
              expect.objectContaining({ bypassAuthError: true })
            );
            expect(toastHandlingService.success).toHaveBeenCalledWith(
              'Thành công',
              'Mật khẩu của bạn đã được đặt lại.'
            );
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
    it('should handle reset password error - invalid token', async () => {
      const error = new HttpErrorResponse({
        error: { statusCode: StatusCode.UNAUTHORIZED },
      });
      (requestService.post as any).mockReturnValue(throwError(() => error));
      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => resolve(),
          error: () => {
            expect(toastHandlingService.error).toHaveBeenCalledWith(
              'Liên kết hết hạn',
              'Vui lòng gửi lại yêu cầu đặt lại mật khẩu mới.'
            );
            resolve();
          },
          complete: () => resolve(),
        });
      });
    });
    it('should handle reset password error - new password same as old', async () => {
      const error = new HttpErrorResponse({
        error: { statusCode: StatusCode.NEW_PASSWORD_SAME_AS_OLD },
      });
      (requestService.post as any).mockReturnValue(throwError(() => error));
      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => resolve(),
          error: () => {
            expect(toastHandlingService.warn).toHaveBeenCalledWith(
              'Cảnh báo xác thực',
              'Mật khẩu mới không được trùng với mật khẩu hiện tại.'
            );
            resolve();
          },
          complete: () => resolve(),
        });
      });
    });
    it('should handle reset password error - general', async () => {
      const error = new HttpErrorResponse({ error: { statusCode: 9999 } });
      (requestService.post as any).mockReturnValue(throwError(() => error));
      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => resolve(),
          error: () => {
            expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
            resolve();
          },
          complete: () => resolve(),
        });
      });
    });
    it('should handle reset password response with error', async () => {
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SYSTEM_ERROR })
      );
      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => {
            expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
  });

  describe('changePassword', () => {
    it('should handle successful change password', async () => {
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS })
      );
      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/change-password'),
              mockChangePasswordRequest,
              expect.objectContaining({ loadingKey: 'change-password-form' })
            );
            expect(toastHandlingService.success).toHaveBeenCalledWith(
              'Thành công',
              'Mật khẩu của bạn đã được đặt lại.'
            );
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
    it('should handle change password error - incorrect current password', async () => {
      const error = new HttpErrorResponse({
        error: { statusCode: StatusCode.INCORRECT_CURRENT_PASSWORD },
      });
      (requestService.post as any).mockReturnValue(throwError(() => error));
      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
          next: () => resolve(),
          error: () => {
            expect(toastHandlingService.warn).toHaveBeenCalledWith(
              'Cảnh báo xác thực',
              'Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra và thử lại.'
            );
            resolve();
          },
          complete: () => resolve(),
        });
      });
    });
    it('should handle change password error - new password same as old', async () => {
      const error = new HttpErrorResponse({
        error: { statusCode: StatusCode.NEW_PASSWORD_SAME_AS_OLD },
      });
      (requestService.post as any).mockReturnValue(throwError(() => error));
      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
          next: () => resolve(),
          error: () => {
            expect(toastHandlingService.warn).toHaveBeenCalledWith(
              'Cảnh báo xác thực',
              'Mật khẩu mới không được trùng với mật khẩu hiện tại.'
            );
            resolve();
          },
          complete: () => resolve(),
        });
      });
    });
    it('should handle change password error - general', async () => {
      const error = new HttpErrorResponse({ error: { statusCode: 9999 } });
      (requestService.post as any).mockReturnValue(throwError(() => error));
      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
          next: () => resolve(),
          error: () => {
            expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
            resolve();
          },
          complete: () => resolve(),
        });
      });
    });
    it('should handle change password response with error', async () => {
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SYSTEM_ERROR })
      );
      await new Promise<void>(resolve => {
        service.changePassword(mockChangePasswordRequest).subscribe({
          next: () => {
            expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
  });

  describe('model coverage tests', () => {
    it('should handle reset password with different password combinations', async () => {
      const differentPasswordRequest = {
        ...mockResetPasswordRequest,
        password: 'differentPassword123',
        confirmPassword: 'differentPassword123',
      };
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS })
      );
      await new Promise<void>(resolve => {
        service.resetPassword(differentPasswordRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/reset-password'),
              differentPasswordRequest,
              expect.objectContaining({ bypassAuthError: true })
            );
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
    it('should handle change password with different logout behaviors', async () => {
      const differentLogoutRequest = {
        ...mockChangePasswordRequest,
        logoutBehavior: 1,
      };
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS })
      );
      await new Promise<void>(resolve => {
        service.changePassword(differentLogoutRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/change-password'),
              differentLogoutRequest,
              expect.objectContaining({ loadingKey: 'change-password-form' })
            );
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
    it('should handle forgot password with different email formats', async () => {
      const differentEmailRequest = {
        ...mockEmailLinkRequest,
        email: 'another@test.com',
      };
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS })
      );
      await new Promise<void>(resolve => {
        service.forgotPassword(differentEmailRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/forgot-password'),
              expect.objectContaining({
                email: differentEmailRequest.email,
                clientUrl: expect.any(String),
              })
            );
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
    it('should verify all model properties are passed correctly', async () => {
      (requestService.post as any).mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS })
      );
      await new Promise<void>(resolve => {
        service.resetPassword(mockResetPasswordRequest).subscribe({
          next: () => {
            expect(requestService.post).toHaveBeenCalledWith(
              expect.stringContaining('/auth/reset-password'),
              expect.objectContaining({
                email: mockResetPasswordRequest.email,
                password: mockResetPasswordRequest.password,
                confirmPassword: mockResetPasswordRequest.confirmPassword,
                token: mockResetPasswordRequest.token,
              }),
              expect.objectContaining({ bypassAuthError: true })
            );
            resolve();
          },
          error: () => resolve(),
          complete: () => resolve(),
        });
      });
    });
  });
});
