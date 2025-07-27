import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { UserService } from '../../../shared/services/api/user/user.service';
import { EmailVerificationService } from './email-verification.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { GlobalModalService } from '../../../shared/services/layout/global-modal/global-modal.service';
import { Router } from '@angular/router';

import { StatusCode } from '../../../shared/constants/status-code.constant';
import { UserRoles } from '../../../shared/constants/user-roles.constant';

import { type LoginRequest } from '../pages/login/models/login-request.model';
import { type RefreshTokenRequest } from '../models/request/refresh-token-request.model';
import { type AuthTokenResponse } from '../models/response/auth-response.model';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: any;
  let userService: any;
  let emailVerificationService: any;
  let requestService: any;
  let toastHandlingService: any;
  let globalModalService: any;
  let router: any;

  const mockAuthTokenResponse: AuthTokenResponse = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600,
    requires2FA: false,
    email: 'test@example.com',
  };

  const mockLoginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockRefreshTokenRequest: RefreshTokenRequest = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    roles: [UserRoles.SYSTEM_ADMIN],
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock instances
    jwtService = {
      getAccessToken: vi.fn().mockReturnValue('mock-token'),
      setAccessToken: vi.fn(),
      setRefreshToken: vi.fn(),
      setExpiresDate: vi.fn(),
      clearAll: vi.fn(),
    };

    userService = {
      getCurrentProfile: vi.fn().mockReturnValue(of(mockUser)),
      clearCurrentUser: vi.fn(),
    };

    emailVerificationService = {
      resendConfirmEmail: vi.fn().mockReturnValue(of(void 0)),
    };

    requestService = {
      post: vi.fn().mockReturnValue(of(void 0)),
    };

    toastHandlingService = {
      errorGeneral: vi.fn(),
      error: vi.fn(),
    };

    globalModalService = {
      close: vi.fn(),
    };

    router = {
      navigateByUrl: vi.fn(),
      navigate: vi.fn(),
    };

    // Configure TestBed with mocked providers
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: UserService, useValue: userService },
        {
          provide: EmailVerificationService,
          useValue: emailVerificationService,
        },
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastHandlingService },
        { provide: GlobalModalService, useValue: globalModalService },
        { provide: Router, useValue: router },
      ],
    });

    // Get service instance from TestBed
    service = TestBed.inject(AuthService);
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize isLoggedIn signal based on JWT token', () => {
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should initialize isLoggedIn signal as false when no JWT token', () => {
      // Create a new mock with null return value
      const nullJwtService = {
        getAccessToken: vi.fn().mockReturnValue(null),
        setAccessToken: vi.fn(),
        setRefreshToken: vi.fn(),
        setExpiresDate: vi.fn(),
        clearAll: vi.fn(),
      };

      // Configure a new TestBed for this specific test
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          { provide: JwtService, useValue: nullJwtService },
          { provide: UserService, useValue: userService },
          {
            provide: EmailVerificationService,
            useValue: emailVerificationService,
          },
          { provide: RequestService, useValue: requestService },
          { provide: ToastHandlingService, useValue: toastHandlingService },
          { provide: GlobalModalService, useValue: globalModalService },
          { provide: Router, useValue: router },
        ],
      });

      const newService = TestBed.inject(AuthService);
      expect(newService.isLoggedIn()).toBe(false);
    });
  });

  describe('login', () => {
    it('should handle successful login and set isLoggedIn true for admin', async () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockAuthTokenResponse,
      };

      requestService.post.mockReturnValue(of(mockResponse));
      userService.getCurrentProfile.mockReturnValue(of(mockUser));

      const result = await service.login(mockLoginRequest).toPromise();

      expect(result).toEqual(mockAuthTokenResponse);
      expect(jwtService.setAccessToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.accessToken
      );
      expect(jwtService.setRefreshToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.refreshToken
      );
      expect(jwtService.setExpiresDate).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/', {
        replaceUrl: true,
      });
      // Wait for async
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should handle login with non-admin user and set isLoggedIn false after timeout', async () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockAuthTokenResponse,
      };

      const nonAdminUser = { ...mockUser, roles: [UserRoles.STUDENT] };

      requestService.post.mockReturnValue(of(mockResponse));
      userService.getCurrentProfile.mockReturnValue(of(nonAdminUser));

      const result = await service.login(mockLoginRequest).toPromise();

      expect(result).toEqual(mockAuthTokenResponse);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/errors/403');
      // The clearSession is called in a setTimeout, so we need to wait
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(jwtService.clearAll).toHaveBeenCalled();
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should handle login failure with invalid credentials', async () => {
      const mockError = new HttpErrorResponse({
        error: { statusCode: StatusCode.INVALID_CREDENTIALS },
      });

      requestService.post.mockReturnValue(throwError(() => mockError));

      const result = await service.login(mockLoginRequest).toPromise();

      expect(result).toBeNull();
      expect(toastHandlingService.error).toHaveBeenCalledWith(
        'Đăng nhập thất bại',
        'Tên đăng nhập hoặc mật khẩu chưa chính xác.'
      );
    });

    it('should call resendConfirmEmail with correct params when user not confirmed', async () => {
      const mockError = new HttpErrorResponse({
        error: { statusCode: StatusCode.USER_NOT_CONFIRMED },
      });
      requestService.post.mockReturnValue(throwError(() => mockError));
      emailVerificationService.resendConfirmEmail.mockReturnValue(of(void 0));

      const result = await service.login(mockLoginRequest).toPromise();

      expect(result).toBeNull();
      expect(toastHandlingService.error).toHaveBeenCalledWith(
        'Đăng nhập thất bại',
        'Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để hoàn tất xác minh.'
      );
      expect(emailVerificationService.resendConfirmEmail).toHaveBeenCalledWith(
        {
          email: mockLoginRequest.email,
          clientUrl: expect.any(String),
        },
        expect.objectContaining({
          title: expect.any(String),
          description: expect.any(String),
        })
      );
    });

    it('should handle login failure with account locked', async () => {
      const mockError = new HttpErrorResponse({
        error: { statusCode: StatusCode.USER_ACCOUNT_LOCKED },
      });

      requestService.post.mockReturnValue(throwError(() => mockError));

      const result = await service.login(mockLoginRequest).toPromise();

      expect(result).toBeNull();
      expect(toastHandlingService.error).toHaveBeenCalledWith(
        'Đăng nhập thất bại',
        'Tài khoản của bạn đã bị vô hiệu hóa.'
      );
    });

    it('should handle OTP verification required', async () => {
      const mockError = new HttpErrorResponse({
        error: { statusCode: StatusCode.REQUIRES_OTP_VERIFICATION },
      });

      requestService.post.mockReturnValue(throwError(() => mockError));

      const result = await service.login(mockLoginRequest).toPromise();

      expect(result).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/otp-confirmation'], {
        queryParams: { email: mockLoginRequest.email },
      });
    });

    it('should handle login response without success status', async () => {
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        data: null,
      };

      requestService.post.mockReturnValue(of(mockResponse));

      const result = await service.login(mockLoginRequest).toPromise();

      expect(result).toBeNull();
      expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
    });

    it('should handle unknown error during login', async () => {
      const mockError = new HttpErrorResponse({
        error: { statusCode: 'UNKNOWN_ERROR' },
      });

      requestService.post.mockReturnValue(throwError(() => mockError));

      const result = await service.login(mockLoginRequest).toPromise();

      expect(result).toBeNull();
      expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should handle successful token refresh and not change isLoggedIn', async () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockAuthTokenResponse,
      };

      requestService.post.mockReturnValue(of(mockResponse));

      const result = await service
        .refreshToken(mockRefreshTokenRequest)
        .toPromise();

      expect(result).toEqual(mockAuthTokenResponse);
      expect(jwtService.setAccessToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.accessToken
      );
      expect(jwtService.setRefreshToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.refreshToken
      );
      expect(jwtService.setExpiresDate).toHaveBeenCalled();
      // isLoggedIn should not be set to false
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should handle refresh token failure and set isLoggedIn false', async () => {
      requestService.post.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      const result = await service
        .refreshToken(mockRefreshTokenRequest)
        .toPromise();

      expect(result).toBeNull();
      expect(jwtService.clearAll).toHaveBeenCalled();
      expect(userService.clearCurrentUser).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should handle refresh token response without success status and set isLoggedIn false', async () => {
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        data: null,
      };

      requestService.post.mockReturnValue(of(mockResponse));

      const result = await service
        .refreshToken(mockRefreshTokenRequest)
        .toPromise();

      expect(result).toBeNull();
      expect(jwtService.clearAll).toHaveBeenCalled();
      expect(userService.clearCurrentUser).toHaveBeenCalled();
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('logout', () => {
    let localStorageMock: any;
    beforeEach(() => {
      // Tạo mock localStorage với key mong muốn
      let store: Record<string, string> = {
        'accordion-open:1': 'true',
        'other-key': 'value',
      };
      localStorageMock = {
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        getItem: vi.fn((key: string) => store[key]),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        clear: vi.fn(() => {
          store = {};
        }),
        key: vi.fn((i: number) => Object.keys(store)[i]),
        get length() {
          return Object.keys(store).length;
        },
      };
      // Gán lại localStorage cho window
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        configurable: true,
        writable: true,
      });
      vi.spyOn(window, 'dispatchEvent');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should handle successful logout and clear all relevant data and set isLoggedIn false', async () => {
      (requestService.post as any).mockReturnValue(of({}));

      await new Promise<void>(resolve => {
        service.logout().subscribe({
          next: () => resolve(),
          error: () => resolve(),
          complete: () => resolve(),
        });
      });

      expect(jwtService.clearAll).toHaveBeenCalled();
      expect(userService.clearCurrentUser).toHaveBeenCalled();
      expect(globalModalService.close).toHaveBeenCalled();
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        new Event('close-all-submenus')
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login', {
        replaceUrl: true,
      });
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('handleLoginSuccess', () => {
    it('should handle login success correctly and set isLoggedIn true for admin', async () => {
      userService.getCurrentProfile.mockReturnValue(of(mockUser));

      service.handleLoginSuccess(mockAuthTokenResponse);

      expect(jwtService.setAccessToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.accessToken
      );
      expect(jwtService.setRefreshToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.refreshToken
      );
      expect(jwtService.setExpiresDate).toHaveBeenCalled();

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(router.navigateByUrl).toHaveBeenCalledWith('/', {
        replaceUrl: true,
      });
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should handle login success with no user profile and not set isLoggedIn', async () => {
      userService.getCurrentProfile.mockReturnValue(of(null));

      service.handleLoginSuccess(mockAuthTokenResponse);

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
      // Theo logic hiện tại, isLoggedIn vẫn là true
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should handle login success with non-admin user and set isLoggedIn false after timeout', async () => {
      const nonAdminUser = { ...mockUser, roles: [UserRoles.STUDENT] };
      userService.getCurrentProfile.mockReturnValue(of(nonAdminUser));

      service.handleLoginSuccess(mockAuthTokenResponse);

      await new Promise(resolve => setTimeout(resolve, 350));
      expect(router.navigateByUrl).toHaveBeenCalledWith('/errors/403');
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('clearSession', () => {
    it('should clear session and set isLoggedIn false', () => {
      service.clearSession();
      expect(jwtService.clearAll).toHaveBeenCalled();
      expect(userService.clearCurrentUser).toHaveBeenCalled();
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('private methods', () => {
    it('should handle token storage correctly', () => {
      // Access private method through public method
      service.handleLoginSuccess(mockAuthTokenResponse);

      expect(jwtService.setAccessToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.accessToken
      );
      expect(jwtService.setRefreshToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.refreshToken
      );

      // Test that setExpiresDate was called with a date that is approximately the expected time
      expect(jwtService.setExpiresDate).toHaveBeenCalled();
      const actualCall = jwtService.setExpiresDate.mock.calls[0][0];
      const expectedTime = Date.now() + mockAuthTokenResponse.expiresIn * 1000;
      const actualTime = new Date(actualCall).getTime();

      // Allow for a small timing difference (within 100ms)
      expect(Math.abs(actualTime - expectedTime)).toBeLessThan(100);
    });

    it('should clear session correctly', async () => {
      // Access private method through public method
      await new Promise<void>(resolve => {
        service.logout().subscribe({
          next: () => resolve(),
          error: () => resolve(),
          complete: () => resolve(),
        });
      });

      expect(jwtService.clearAll).toHaveBeenCalled();
      expect(userService.clearCurrentUser).toHaveBeenCalled();
    });
  });
});
