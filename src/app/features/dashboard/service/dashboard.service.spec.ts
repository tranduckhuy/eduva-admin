import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { DashboardService } from './dashboard.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { DashboardResponse } from '../../../shared/models/api/response/query/dashboard-response.model';
import { DashboardRequest } from '../../../shared/models/api/request/command/dashboard-request.model';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { BaseResponse } from '../../../shared/models/api/base-response.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let requestService: any;
  let toastService: any;
  let loadingService: any;

  const mockDashboardResponse: DashboardResponse = {
    systemOverview: {
      totalUsers: 1000,
      schoolAdmins: 50,
      systemAdmins: 5,
      contentModerators: 20,
      teachers: 200,
      students: 725,
      totalLessons: 500,
      uploadedLessons: 300,
      aiGeneratedLessons: 200,
      totalSchools: 25,
      creditPackRevenue: 50000,
      subscriptionPlanRevenue: 75000,
      totalRevenue: 125000,
      totalStorageUsedBytes: 1073741824,
      totalStorageUsedGB: 1,
    },
    lessonActivity: [
      {
        period: '2024-01',
        uploadedCount: 50,
        aiGeneratedCount: 30,
        totalCount: 80,
      },
    ],
    topSchools: [
      {
        schoolId: 1,
        schoolName: 'Test School',
        lessonCount: 100,
        userCount: 200,
        hasActiveSubscription: true,
      },
    ],
    userRegistrations: [
      {
        period: '2024-01',
        totalRegistrations: 150,
        schoolAdmins: 5,
        contentModerators: 2,
        teachers: 20,
        students: 123,
      },
    ],
    revenueStats: [
      {
        period: '2024-01',
        creditPackRevenue: 10000,
        subscriptionRevenue: 15000,
        totalRevenue: 25000,
      },
    ],
  };

  const mockDashboardRequest: DashboardRequest = {
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    lessonActivityPeriod: 'MONTH' as any,
    userRegistrationPeriod: 'MONTH' as any,
    revenuePeriod: 'MONTH' as any,
    topSchoolsCount: 10,
  };

  const mockSuccessResponse: BaseResponse<DashboardResponse> = {
    statusCode: StatusCode.SUCCESS,
    message: 'Dashboard data retrieved successfully',
    data: mockDashboardResponse,
  };

  const mockErrorResponse: BaseResponse<DashboardResponse> = {
    statusCode: StatusCode.SYSTEM_ERROR,
    message: 'System error occurred',
    data: undefined,
  };

  beforeEach(() => {
    const requestServiceSpy = {
      get: vi.fn(),
    };

    const toastServiceSpy = {
      errorGeneral: vi.fn(),
    };

    const loadingServiceSpy = {
      start: vi.fn(),
      stop: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DashboardService,
        { provide: RequestService, useValue: requestServiceSpy },
        { provide: ToastHandlingService, useValue: toastServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });

    service = TestBed.inject(DashboardService);
    requestService = TestBed.inject(RequestService);
    toastService = TestBed.inject(ToastHandlingService);
    loadingService = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDashboardData', () => {
    it('should fetch dashboard data successfully and update signal', async () => {
      // Arrange
      requestService.get.mockReturnValue(of(mockSuccessResponse));

      // Act
      const result = await service
        .getDashboardData(mockDashboardRequest)
        .toPromise();

      // Assert
      expect(result).toEqual(mockDashboardResponse);
      expect(service.dashboardData()).toEqual(mockDashboardResponse);
      expect(loadingService.start).toHaveBeenCalledWith('dashboard');
      expect(loadingService.stop).toHaveBeenCalledWith('dashboard');
      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining('/dashboards/system-admin'),
        mockDashboardRequest
      );
    });

    it('should handle successful response with undefined data', async () => {
      // Arrange
      const responseWithUndefinedData: BaseResponse<DashboardResponse> = {
        statusCode: StatusCode.SUCCESS,
        message: 'Success but no data',
        data: undefined,
      };
      requestService.get.mockReturnValue(of(responseWithUndefinedData));

      // Act
      const result = await service
        .getDashboardData(mockDashboardRequest)
        .toPromise();

      // Assert
      expect(result).toBeNull();
      expect(service.dashboardData()).toBeNull();
      expect(toastService.errorGeneral).toHaveBeenCalled();
      expect(loadingService.start).toHaveBeenCalledWith('dashboard');
      expect(loadingService.stop).toHaveBeenCalledWith('dashboard');
    });

    it('should handle error response status code', async () => {
      // Arrange
      requestService.get.mockReturnValue(of(mockErrorResponse));

      // Act
      const result = await service
        .getDashboardData(mockDashboardRequest)
        .toPromise();

      // Assert
      expect(result).toBeNull();
      expect(service.dashboardData()).toBeNull();
      expect(toastService.errorGeneral).toHaveBeenCalled();
      expect(loadingService.start).toHaveBeenCalledWith('dashboard');
      expect(loadingService.stop).toHaveBeenCalledWith('dashboard');
    });

    it('should handle HTTP error', async () => {
      // Arrange
      const httpError = new Error('Network error');
      requestService.get.mockReturnValue(throwError(() => httpError));

      // Act
      const result = await service
        .getDashboardData(mockDashboardRequest)
        .toPromise();

      // Assert
      expect(result).toBeUndefined();
      expect(toastService.errorGeneral).toHaveBeenCalled();
      expect(loadingService.start).toHaveBeenCalledWith('dashboard');
      expect(loadingService.stop).toHaveBeenCalledWith('dashboard');
    });

    it('should handle empty request parameters', async () => {
      // Arrange
      const emptyRequest: DashboardRequest = {};
      requestService.get.mockReturnValue(of(mockSuccessResponse));

      // Act
      const result = await service.getDashboardData(emptyRequest).toPromise();

      // Assert
      expect(result).toEqual(mockDashboardResponse);
      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining('/dashboards/system-admin'),
        emptyRequest
      );
    });

    it('should preserve existing signal data when request fails', async () => {
      // Arrange
      // First set some data
      requestService.get.mockReturnValue(of(mockSuccessResponse));
      await service.getDashboardData(mockDashboardRequest).toPromise();

      // Then make a failing request
      requestService.get.mockReturnValue(of(mockErrorResponse));

      // Act
      const result = await service
        .getDashboardData(mockDashboardRequest)
        .toPromise();

      // Assert
      expect(result).toBeNull();
      // Signal should still have the previous successful data
      expect(service.dashboardData()).toEqual(mockDashboardResponse);
    });
  });

  describe('dashboardData signal', () => {
    it('should be readonly', () => {
      // Assert
      expect(service.dashboardData).toBeDefined();
      expect(typeof service.dashboardData).toBe('function');
    });

    it('should initially be null', () => {
      // Assert
      expect(service.dashboardData()).toBeNull();
    });

    it('should update when successful data is fetched', async () => {
      // Arrange
      requestService.get.mockReturnValue(of(mockSuccessResponse));

      // Act
      await service.getDashboardData(mockDashboardRequest).toPromise();

      // Assert
      expect(service.dashboardData()).toEqual(mockDashboardResponse);
    });
  });

  describe('loading state management', () => {
    it('should start loading before making request', async () => {
      // Arrange
      requestService.get.mockReturnValue(of(mockSuccessResponse));

      // Act
      await service.getDashboardData(mockDashboardRequest).toPromise();

      // Assert
      expect(loadingService.start).toHaveBeenCalledWith('dashboard');
      expect(loadingService.stop).toHaveBeenCalledWith('dashboard');
    });

    it('should stop loading even when request fails', async () => {
      // Arrange
      requestService.get.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      // Act
      await service.getDashboardData(mockDashboardRequest).toPromise();

      // Assert
      expect(loadingService.start).toHaveBeenCalledWith('dashboard');
      expect(loadingService.stop).toHaveBeenCalledWith('dashboard');
    });
  });

  describe('error handling', () => {
    it('should show error toast for non-success status codes', async () => {
      // Arrange
      requestService.get.mockReturnValue(of(mockErrorResponse));

      // Act
      await service.getDashboardData(mockDashboardRequest).toPromise();

      // Assert
      expect(toastService.errorGeneral).toHaveBeenCalled();
    });

    it('should show error toast for HTTP errors', async () => {
      // Arrange
      requestService.get.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      // Act
      await service.getDashboardData(mockDashboardRequest).toPromise();

      // Assert
      expect(toastService.errorGeneral).toHaveBeenCalled();
    });

    it('should show error toast for undefined data in success response', async () => {
      // Arrange
      const responseWithUndefinedData: BaseResponse<DashboardResponse> = {
        statusCode: StatusCode.SUCCESS,
        message: 'Success but no data',
        data: undefined,
      };
      requestService.get.mockReturnValue(of(responseWithUndefinedData));

      // Act
      await service.getDashboardData(mockDashboardRequest).toPromise();

      // Assert
      expect(toastService.errorGeneral).toHaveBeenCalled();
    });
  });

  describe('API URL construction', () => {
    it('should use correct base URL', async () => {
      // Arrange
      requestService.get.mockReturnValue(of(mockSuccessResponse));

      // Act
      await service.getDashboardData(mockDashboardRequest).toPromise();

      // Assert
      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining('/dashboards/system-admin'),
        mockDashboardRequest
      );
    });
  });
});
