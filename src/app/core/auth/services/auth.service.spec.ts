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
    it('should handle successful login', async () => {
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
    });

    it('should handle login with non-admin user', async () => {
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

    it('should handle login failure with user not confirmed', async () => {
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
      expect(emailVerificationService.resendConfirmEmail).toHaveBeenCalled();
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
    it('should handle successful token refresh', async () => {
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
    });

    it('should handle refresh token failure', async () => {
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
    });

    it('should handle refresh token response without success status', async () => {
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
    });
  });

  describe('logout', () => {
    it('should handle successful logout', async () => {
      requestService.post.mockReturnValue(of(void 0));

      // Mock localStorage
      const mockLocalStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Mock Object.keys for localStorage
      Object.keys = vi.fn().mockReturnValue(['testKey']);

      // Mock window.dispatchEvent
      const mockDispatchEvent = vi.fn();
      Object.defineProperty(window, 'dispatchEvent', {
        value: mockDispatchEvent,
        writable: true,
      });

      await service.logout().toPromise();

      expect(jwtService.clearAll).toHaveBeenCalled();
      expect(userService.clearCurrentUser).toHaveBeenCalled();
      expect(globalModalService.close).toHaveBeenCalled();
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        new Event('close-all-submenus')
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login', {
        replaceUrl: true,
      });
    });

    it('should handle logout error', async () => {
      requestService.post.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      await service.logout().toPromise();

      // When logout fails, nothing happens (no clearSession, no navigation)
      expect(jwtService.clearAll).not.toHaveBeenCalled();
      expect(userService.clearCurrentUser).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('handleLoginSuccess', () => {
    it('should handle login success correctly', async () => {
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
    });

    it('should handle login success with no user profile', async () => {
      userService.getCurrentProfile.mockReturnValue(of(null));

      service.handleLoginSuccess(mockAuthTokenResponse);

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(toastHandlingService.errorGeneral).toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    it('should handle token storage correctly', () => {
      const expiresDate = new Date(
        Date.now() + mockAuthTokenResponse.expiresIn * 1000
      ).toISOString();

      // Access private method through public method
      service.handleLoginSuccess(mockAuthTokenResponse);

      expect(jwtService.setAccessToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.accessToken
      );
      expect(jwtService.setRefreshToken).toHaveBeenCalledWith(
        mockAuthTokenResponse.refreshToken
      );
      expect(jwtService.setExpiresDate).toHaveBeenCalledWith(expiresDate);
    });

    it('should clear session correctly', async () => {
      // Access private method through public method
      await service.logout().toPromise();

      expect(jwtService.clearAll).toHaveBeenCalled();
      expect(userService.clearCurrentUser).toHaveBeenCalled();
    });
  });
});
