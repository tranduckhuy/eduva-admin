import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, EMPTY } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { SystemConfigService } from './system-config.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { SystemConfig } from '../../../shared/models/entities/system-config.model';
import { UpdateSystemConfigRequest } from '../../../shared/models/api/request/command/update-system-config-request.model';

describe('SystemConfigService', () => {
  let service: SystemConfigService;
  let requestService: {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
  };
  let toastService: {
    success: ReturnType<typeof vi.fn>;
    errorGeneral: ReturnType<typeof vi.fn>;
  };

  const mockSystemConfigs: SystemConfig[] = [
    {
      key: 'SITE_NAME',
      value: 'Eduva',
      id: 1,
      description: 'Tên trang web',
      createdAt: '2025-08-06T01:45:47.000Z',
      lastModifiedAt: '2025-08-06T01:45:47.000Z',
    },
    {
      key: 'MAINTENANCE_MODE',
      value: 'false',
      id: 2,
      description: 'Chế độ bảo trì',
      createdAt: '2025-08-06T01:45:47.000Z',
      lastModifiedAt: '2025-08-06T01:45:47.000Z',
    },
    {
      key: 'MAX_LOGIN_ATTEMPTS',
      value: '5',
      id: 3,
      description: 'Số lần đăng nhập thất bại tối đa',
      createdAt: '2025-08-06T01:45:47.000Z',
      lastModifiedAt: '2025-08-06T01:45:47.000Z',
    },
  ];

  beforeEach(() => {
    requestService = {
      get: vi.fn(),
      put: vi.fn(),
    };

    toastService = {
      success: vi.fn(),
      errorGeneral: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SystemConfigService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastService },
      ],
    });

    service = TestBed.inject(SystemConfigService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty initial signals', () => {
      expect(service.systemConfig()).toEqual([]);
    });
  });

  describe('getSystemConfig', () => {
    it('should fetch system configs and update signals on success', () => {
      // Arrange
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockSystemConfigs,
      };

      requestService.get.mockReturnValue(of(mockResponse));

      // Act & Assert
      service.getSystemConfig().subscribe(response => {
        expect(response).toEqual(mockSystemConfigs);
        expect(service.systemConfig()).toEqual(mockSystemConfigs);
        expect(requestService.get).toHaveBeenCalledWith(
          expect.stringContaining('/admin/system-configs'),
          {},
          { loadingKey: 'get-system-config' }
        );
      });
    });

    it('should handle error and reset configs on non-success status', () => {
      // Arrange
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      requestService.get.mockReturnValue(of(mockResponse));

      // Act & Assert
      service.getSystemConfig().subscribe(response => {
        expect(response).toBeNull();
        expect(service.systemConfig()).toEqual([]);
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle HTTP error and return EMPTY', () => {
      // Arrange
      const error = new Error('Test error');
      requestService.get.mockReturnValue(throwError(() => error));

      // Act & Assert
      service.getSystemConfig().subscribe({
        next: () => fail('should not be called'),
        error: () => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('updateSystemConfig', () => {
    const key = 'SITE_NAME';
    const updateRequest: UpdateSystemConfigRequest = {
      value: 'Eduva Updated',
      description: 'Updated site name',
      key: 'SITE_NAME',
    };

    it('should update system config and show success message', () => {
      // Arrange
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      requestService.put.mockReturnValue(of(mockResponse));

      // Act & Assert
      service.updateSystemConfig(key, updateRequest).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Cập nhật cấu hình hệ thống thành công!'
        );
        expect(requestService.put).toHaveBeenCalledWith(
          expect.stringContaining(`/admin/system-configs/${key}`),
          updateRequest,
          { loadingKey: 'update-system-config' }
        );
      });
    });

    it('should show error message on update failure', async () => {
      // Arrange
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Validation failed',
      };

      requestService.put.mockReturnValue(of(mockResponse));

      // Act
      await new Promise<void>((resolve) => {
        service.updateSystemConfig(key, updateRequest).subscribe({
          next: () => {
            // Assert
            expect(toastService.errorGeneral).toHaveBeenCalled();
            resolve();
          },
          error: () => {
            // This should not be called
            expect(true).toBe(false);
            resolve();
          }
        });
      });
    });

    it('should handle HTTP error during update', () => {
      // Arrange
      const error = new Error('Update failed');
      requestService.put.mockReturnValue(throwError(() => error));

      // Act & Assert
      service.updateSystemConfig(key, updateRequest).subscribe({
        next: () => fail('should not be called'),
        error: () => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('helper methods', () => {
    it('should reset system config signal', () => {
      // Arrange - set some initial data
      (service as any).systemConfigSignal.set(mockSystemConfigs);

      // Act
      (service as any).resetSystemConfig();

      // Assert
      expect(service.systemConfig()).toEqual([]);
    });
  });
});
