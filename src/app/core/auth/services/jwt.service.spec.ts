import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { CookieService } from 'ngx-cookie-service';
import { JwtService } from './jwt.service'; // Adjust path as necessary
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  EXPIRES_DATE_KEY,
} from '../../../shared/constants/jwt.constant'; // Adjust path as necessary

describe('JwtService', () => {
  let service: JwtService;
  let cookieServiceMock: Partial<CookieService>;

  beforeEach(() => {
    // Create a mock for CookieService
    cookieServiceMock = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    };

    // Configure TestBed to provide the JwtService and the mocked CookieService
    TestBed.configureTestingModule({
      providers: [
        JwtService,
        { provide: CookieService, useValue: cookieServiceMock },
      ],
    });

    // Get the instance of JwtService from the TestBed injector
    service = TestBed.inject(JwtService);
  });

  // Test case for getAccessToken method
  it('should return access token from cookie service', () => {
    const mockAccessToken = 'mock_access_token';
    // Mock the 'get' method of cookieServiceMock to return a specific value
    (cookieServiceMock.get as ReturnType<typeof vi.fn>).mockReturnValue(
      mockAccessToken
    );

    // Call the method under test
    const accessToken = service.getAccessToken();

    // Assertions
    expect(cookieServiceMock.get).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
    expect(accessToken).toBe(mockAccessToken);
  });

  // Test case for getAccessToken when no token exists
  it('should return null if access token does not exist', () => {
    (cookieServiceMock.get as ReturnType<typeof vi.fn>).mockReturnValue(''); // ngx-cookie-service returns empty string if not found

    const accessToken = service.getAccessToken();

    expect(cookieServiceMock.get).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
    expect(accessToken).toBeNull();
  });

  // Test case for setAccessToken method
  it('should set access token using cookie service', () => {
    const newAccessToken = 'new_access_token';
    service.setAccessToken(newAccessToken);

    // Assertions: Check if cookieService.set was called with correct arguments
    expect(cookieServiceMock.set).toHaveBeenCalledWith(
      ACCESS_TOKEN_KEY,
      newAccessToken,
      undefined, // expires
      '/', // path
      undefined, // domain
      true, // secure
      'Strict' // sameSite
    );
  });

  // Test case for removeToken method
  it('should remove access token using cookie service', () => {
    service.removeToken();

    // Assertions: Check if cookieService.delete was called with correct arguments
    expect(cookieServiceMock.delete).toHaveBeenCalledWith(
      ACCESS_TOKEN_KEY,
      '/'
    );
  });

  // Test case for getRefreshToken method
  it('should return refresh token from cookie service', () => {
    const mockRefreshToken = 'mock_refresh_token';
    (cookieServiceMock.get as ReturnType<typeof vi.fn>).mockReturnValue(
      mockRefreshToken
    );

    const refreshToken = service.getRefreshToken();

    expect(cookieServiceMock.get).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    expect(refreshToken).toBe(mockRefreshToken);
  });

  // Test case for getRefreshToken when no token exists
  it('should return null if refresh token does not exist', () => {
    (cookieServiceMock.get as ReturnType<typeof vi.fn>).mockReturnValue('');

    const refreshToken = service.getRefreshToken();

    expect(cookieServiceMock.get).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    expect(refreshToken).toBeNull();
  });

  // Test case for setRefreshToken method
  it('should set refresh token using cookie service', () => {
    const newRefreshToken = 'new_refresh_token';
    service.setRefreshToken(newRefreshToken);

    expect(cookieServiceMock.set).toHaveBeenCalledWith(
      REFRESH_TOKEN_KEY,
      newRefreshToken,
      undefined,
      '/',
      undefined,
      true,
      'Strict'
    );
  });

  // Test case for removeRefreshToken method
  it('should remove refresh token using cookie service', () => {
    service.removeRefreshToken();

    expect(cookieServiceMock.delete).toHaveBeenCalledWith(
      REFRESH_TOKEN_KEY,
      '/'
    );
  });

  // Test case for getExpiresDate method
  it('should return expires date from cookie service', () => {
    const mockExpiresDate = '2025-12-31T23:59:59Z';
    (cookieServiceMock.get as ReturnType<typeof vi.fn>).mockReturnValue(
      mockExpiresDate
    );

    const expiresDate = service.getExpiresDate();

    expect(cookieServiceMock.get).toHaveBeenCalledWith(EXPIRES_DATE_KEY);
    expect(expiresDate).toBe(mockExpiresDate);
  });

  // Test case for getExpiresDate when no date exists
  it('should return null if expires date does not exist', () => {
    (cookieServiceMock.get as ReturnType<typeof vi.fn>).mockReturnValue('');

    const expiresDate = service.getExpiresDate();

    expect(cookieServiceMock.get).toHaveBeenCalledWith(EXPIRES_DATE_KEY);
    expect(expiresDate).toBeNull();
  });

  // Test case for setExpiresDate method
  it('should set expires date using cookie service', () => {
    const newExpiresDate = '2026-01-01T00:00:00Z';
    service.setExpiresDate(newExpiresDate);

    expect(cookieServiceMock.set).toHaveBeenCalledWith(
      EXPIRES_DATE_KEY,
      newExpiresDate,
      undefined,
      '/',
      undefined,
      true,
      'Strict'
    );
  });

  // Test case for removeExpiredDate method
  it('should remove expires date using cookie service', () => {
    service.removeExpiredDate();

    expect(cookieServiceMock.delete).toHaveBeenCalledWith(
      EXPIRES_DATE_KEY,
      '/'
    );
  });

  // Test case for clearAll method
  it('should clear all tokens and expires date', () => {
    // Spy on the individual removal methods to ensure they are called
    const removeTokenSpy = vi.spyOn(service, 'removeToken');
    const removeRefreshTokenSpy = vi.spyOn(service, 'removeRefreshToken');
    const removeExpiredDateSpy = vi.spyOn(service, 'removeExpiredDate');

    service.clearAll();

    // Assertions: Check if each removal method was called
    expect(removeTokenSpy).toHaveBeenCalled();
    expect(removeRefreshTokenSpy).toHaveBeenCalled();
    expect(removeExpiredDateSpy).toHaveBeenCalled();

    // Restore the original methods after the test
    removeTokenSpy.mockRestore();
    removeRefreshTokenSpy.mockRestore();
    removeExpiredDateSpy.mockRestore();
  });
});
