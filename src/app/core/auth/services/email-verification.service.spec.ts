import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { EmailVerificationService } from './email-verification.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { type ConfirmEmailRequest } from '../models/request/confirm-email-request.model';
import { type EmailLinkRequest } from '../models/request/email-link-request.model';

describe('EmailVerificationService', () => {
  let service: EmailVerificationService;
  let requestService: any;
  let toastHandlingService: any;

  const mockConfirmEmailRequest: ConfirmEmailRequest = {
    email: 'test@example.com',
    token: 'token123',
  };

  const mockEmailLinkRequest: EmailLinkRequest = {
    email: 'test@example.com',
    clientUrl: 'http://localhost/auth/login',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    requestService = {
      get: vi.fn(),
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
        EmailVerificationService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastHandlingService },
      ],
    });
    service = TestBed.inject(EmailVerificationService);
  });

  describe('confirmEmail', () => {
    it('should call success toast on successful confirmation', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.get.mockReturnValue(of(mockResponse));

      await service.confirmEmail(mockConfirmEmailRequest).toPromise();
      expect(toastHandlingService.success).toHaveBeenCalledWith(
        'Kích hoạt thành công',
        'Tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập để tiếp tục.'
      );
    });

    it('should call errorGeneral toast on non-success confirmation', async () => {
      const mockResponse = { statusCode: StatusCode.SYSTEM_ERROR };
      requestService.get.mockReturnValue(of(mockResponse));

      await service.confirmEmail(mockConfirmEmailRequest).toPromise();
      expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
    });

    it('should call errorGeneral toast on unknown error', async () => {
      const mockError = new HttpErrorResponse({ error: { statusCode: 9999 } });
      requestService.get.mockReturnValue(throwError(() => mockError));

      await service.confirmEmail(mockConfirmEmailRequest).toPromise();
      expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
    });

    it('should resend confirm email if token is invalid or expired', async () => {
      const mockError = new HttpErrorResponse({
        error: {
          statusCode: StatusCode.CONFIRM_EMAIL_TOKEN_INVALID_OR_EXPIRED,
        },
      });
      requestService.get.mockReturnValue(throwError(() => mockError));
      requestService.post.mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS })
      );

      await service.confirmEmail(mockConfirmEmailRequest).toPromise();
      expect(requestService.post).toHaveBeenCalled();
      expect(toastHandlingService.warn).toHaveBeenCalledWith(
        'Liên kết hết hạn',
        'Liên kết xác thực đã hết hạn. Một email xác thực mới đã được gửi lại cho bạn.'
      );
    });
  });

  describe('resendConfirmEmail', () => {
    it('should call success toast on successful resend', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));

      await service.resendConfirmEmail(mockEmailLinkRequest).toPromise();
      expect(toastHandlingService.success).toHaveBeenCalledWith(
        'Email đã được gửi lại',
        'Một liên kết xác thực mới đã được gửi tới địa chỉ email của bạn.'
      );
    });

    it('should call warn toast on successful resend with warn type', async () => {
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      requestService.post.mockReturnValue(of(mockResponse));
      const toastMessage = { title: 'Warn title', description: 'Warn desc' };

      await service
        .resendConfirmEmail(mockEmailLinkRequest, toastMessage, 'warn')
        .toPromise();
      expect(toastHandlingService.warn).toHaveBeenCalledWith(
        'Warn title',
        'Warn desc'
      );
    });

    it('should call errorGeneral toast on resend error', async () => {
      requestService.post.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      await service.resendConfirmEmail(mockEmailLinkRequest).toPromise();
      expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
    });

    it('should call errorGeneral toast on resend non-success', async () => {
      const mockResponse = { statusCode: StatusCode.SYSTEM_ERROR };
      requestService.post.mockReturnValue(of(mockResponse));

      await service.resendConfirmEmail(mockEmailLinkRequest).toPromise();
      expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
    });
  });
});
