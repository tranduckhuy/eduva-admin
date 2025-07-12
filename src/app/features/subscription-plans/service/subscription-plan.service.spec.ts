import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { SubscriptionPlanService } from './subscription-plan.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { SubscriptionPlan } from '../model/subscription-plan.model';
import { SubscriptionPlanRequest } from '../model/subscription-plan-request.model';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';

describe('SubscriptionPlanService', () => {
  let service: SubscriptionPlanService;
  let requestService: RequestService;
  let toastService: ToastHandlingService;

  const mockSubscriptionPlans: SubscriptionPlan[] = [
    {
      id: 1,
      name: 'Basic Plan',
      description: 'Basic subscription plan for small schools',
      maxUsers: 50,
      storageLimitGB: 10,
      priceMonthly: 29.99,
      pricePerYear: 299.99,
      status: 0,
      isRecommended: false,
    },
    {
      id: 2,
      name: 'Premium Plan',
      description: 'Premium subscription plan for medium schools',
      maxUsers: 200,
      storageLimitGB: 50,
      priceMonthly: 79.99,
      pricePerYear: 799.99,
      status: 0,
      isRecommended: true,
    },
    {
      id: 3,
      name: 'Enterprise Plan',
      description: 'Enterprise subscription plan for large schools',
      maxUsers: 1000,
      storageLimitGB: 200,
      priceMonthly: 199.99,
      pricePerYear: 1999.99,
      status: 1,
      isRecommended: false,
    },
  ];

  const mockSubscriptionPlanDetail: SubscriptionPlan = {
    id: 1,
    name: 'Basic Plan',
    description: 'Basic subscription plan for small schools',
    maxUsers: 50,
    storageLimitGB: 10,
    priceMonthly: 29.99,
    pricePerYear: 299.99,
    status: 0,
    isRecommended: false,
  };

  const mockSubscriptionPlanRequest: SubscriptionPlanRequest = {
    name: 'New Plan',
    description: 'A new subscription plan',
    maxUsers: 100,
    storageLimitGB: 25,
    priceMonthly: 49.99,
    pricePerYear: 499.99,
    isRecommended: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SubscriptionPlanService,
        {
          provide: RequestService,
          useValue: {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
          },
        },
        {
          provide: ToastHandlingService,
          useValue: {
            success: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            errorGeneral: vi.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(SubscriptionPlanService);
    requestService = TestBed.inject(RequestService);
    toastService = TestBed.inject(ToastHandlingService);

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty initial signals', () => {
      expect(service.subscriptionPlans()).toEqual([]);
      expect(service.totalSubscriptionPlans()).toEqual(0);
      expect(service.subscriptionPlanDetail()).toBeNull();
    });
  });

  describe('getSubscriptionPlans', () => {
    it('should fetch subscription plans and update signals on success', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockSubscriptionPlans,
          count: mockSubscriptionPlans.length,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlans(params).subscribe(response => {
        expect(response).toEqual({
          data: mockSubscriptionPlans,
          count: mockSubscriptionPlans.length,
        });
        expect(service.subscriptionPlans()).toEqual(mockSubscriptionPlans);
        expect(service.totalSubscriptionPlans()).toEqual(
          mockSubscriptionPlans.length
        );
      });
    });

    it('should reset subscription plans and show error on non-success status', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlans(params).subscribe(response => {
        expect(response).toBeNull();
        expect(service.subscriptionPlans()).toEqual([]);
        expect(service.totalSubscriptionPlans()).toEqual(0);
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const error = new Error('Test error');

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getSubscriptionPlans(params).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('getSubscriptionPlanDetailById', () => {
    it('should fetch subscription plan detail and update signal on success', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockSubscriptionPlanDetail,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlanDetailById(id).subscribe(response => {
        expect(response).toEqual(mockSubscriptionPlanDetail);
        expect(service.subscriptionPlanDetail()).toEqual(
          mockSubscriptionPlanDetail
        );
      });
    });

    it('should reset subscription plan detail and show error on non-success status', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlanDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(service.subscriptionPlanDetail()).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getSubscriptionPlanDetailById(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('createSubscriptionPlan', () => {
    it('should create subscription plan and navigate on success', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.post).mockReturnValue(of(mockResponse));

      service
        .createSubscriptionPlan(mockSubscriptionPlanRequest)
        .subscribe(() => {
          expect(toastService.success).toHaveBeenCalledWith(
            'Thành công',
            'Gói đăng ký đã được tạo mới thành công!'
          );
        });
    });

    it('should show error message on failure', () => {
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.post).mockReturnValue(of(mockResponse));

      service
        .createSubscriptionPlan(mockSubscriptionPlanRequest)
        .subscribe(() => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        });
    });

    it('should handle invalid information error', () => {
      const error = new HttpErrorResponse({
        error: {
          statusCode: StatusCode.PROVIDED_INFORMATION_IS_INVALID,
        },
      });

      vi.mocked(requestService.post).mockReturnValue(throwError(() => error));

      service
        .createSubscriptionPlan(mockSubscriptionPlanRequest)
        .subscribe(() => {
          expect(toastService.error).toHaveBeenCalledWith(
            'Thông tin cung cấp không hợp lệ',
            'Tên gói đăng ký đã tồn tại. Vui lòng chọn tên khác!'
          );
        });
    });

    it('should handle other errors', () => {
      // Use HttpErrorResponse with error property but no statusCode
      const error = new HttpErrorResponse({ error: {} });

      vi.mocked(requestService.post).mockReturnValue(throwError(() => error));

      service
        .createSubscriptionPlan(mockSubscriptionPlanRequest)
        .subscribe(() => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        });
    });
  });

  describe('updateSubscriptionPlan', () => {
    it('should show success message on successful update', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service
        .updateSubscriptionPlan(mockSubscriptionPlanRequest, id)
        .subscribe(() => {
          expect(toastService.success).toHaveBeenCalledWith(
            'Thành công',
            'Gói đăng ký cập nhật thông tin thành công!'
          );
        });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service
        .updateSubscriptionPlan(mockSubscriptionPlanRequest, id)
        .subscribe(() => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        });
    });

    it('should handle invalid information error', () => {
      const id = '1';
      const error = new HttpErrorResponse({
        error: {
          statusCode: StatusCode.PROVIDED_INFORMATION_IS_INVALID,
        },
      });

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service
        .updateSubscriptionPlan(mockSubscriptionPlanRequest, id)
        .subscribe(() => {
          expect(toastService.warn).toHaveBeenCalledWith(
            'Không thể cập nhật gói',
            'Tên gói đăng ký đã tồn tại. Vui lòng chọn tên khác!'
          );
        });
    });

    it('should handle plan in use error', () => {
      const id = '1';
      const error = new HttpErrorResponse({
        error: {
          statusCode: StatusCode.PLAN_IN_USE,
        },
      });

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service
        .updateSubscriptionPlan(mockSubscriptionPlanRequest, id)
        .subscribe(() => {
          expect(toastService.warn).toHaveBeenCalledWith(
            'Không thể cập nhật gói',
            'Gói đăng ký này đang được sử dụng bởi một hoặc nhiều trường và không thể vô hiệu hóa.'
          );
        });
    });

    it('should handle other errors', () => {
      // Use HttpErrorResponse with error property but no statusCode
      const id = '1';
      const error = new HttpErrorResponse({ error: {} });

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service
        .updateSubscriptionPlan(mockSubscriptionPlanRequest, id)
        .subscribe(() => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        });
    });
  });

  describe('activateSubscriptionPlan', () => {
    it('should show success message on successful activation', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateSubscriptionPlan(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Kích hoạt gói đăng ký thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateSubscriptionPlan(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return void', () => {
      const id = '1';
      const error = new Error('Test error');

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.activateSubscriptionPlan(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('archiveSubscriptionPlan', () => {
    it('should show success message on successful archiving', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveSubscriptionPlan(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Vô hiệu hóa gói đăng ký thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveSubscriptionPlan(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return void', () => {
      const id = '1';
      const error = new Error('Test error');

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.archiveSubscriptionPlan(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('signal management', () => {
    it('should expose readonly signals', () => {
      expect(typeof service.subscriptionPlans).toBe('function');
      expect(typeof service.totalSubscriptionPlans).toBe('function');
      expect(typeof service.subscriptionPlanDetail).toBe('function');
    });

    it('should update signals reactively', () => {
      const initialPlans = service.subscriptionPlans();
      const initialTotal = service.totalSubscriptionPlans();

      service['subscriptionPlansSignal'].set(mockSubscriptionPlans);
      service['totalSubscriptionPlansSignal'].set(mockSubscriptionPlans.length);

      expect(service.subscriptionPlans()).toEqual(mockSubscriptionPlans);
      expect(service.totalSubscriptionPlans()).toEqual(
        mockSubscriptionPlans.length
      );
      expect(service.subscriptionPlans()).not.toEqual(initialPlans);
      expect(service.totalSubscriptionPlans()).not.toEqual(initialTotal);
    });
  });

  describe('reset methods', () => {
    it('should reset subscription plans signal', () => {
      // Set initial data
      service['subscriptionPlansSignal'].set(mockSubscriptionPlans);
      service['totalSubscriptionPlansSignal'].set(mockSubscriptionPlans.length);

      service['resetSubscriptionPlans']();

      expect(service.subscriptionPlans()).toEqual([]);
      expect(service.totalSubscriptionPlans()).toEqual(0);
    });

    it('should reset subscription plan detail signal', () => {
      // Set initial data
      service['subscriptionPlanDetailSignal'].set(mockSubscriptionPlanDetail);

      service['resetSubscriptionPlanDetail']();

      expect(service.subscriptionPlanDetail()).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle null response data', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: null,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlanDetailById('1').subscribe(response => {
        expect(response).toBeNull();
      });
    });

    it('should handle undefined response data', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlanDetailById('1').subscribe(response => {
        expect(response).toBeNull();
      });
    });

    it('should handle empty subscription plans list', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: [],
          count: 0,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlans(params).subscribe(response => {
        expect(response).toEqual({
          data: [],
          count: 0,
        });
        expect(service.subscriptionPlans()).toEqual([]);
        expect(service.totalSubscriptionPlans()).toEqual(0);
      });
    });

    it('should handle subscription plan without description', () => {
      const planWithoutDescription: SubscriptionPlan = {
        id: 4,
        name: 'Plan Without Description',
        maxUsers: 25,
        storageLimitGB: 5,
        priceMonthly: 19.99,
        pricePerYear: 199.99,
        status: 0,
        isRecommended: false,
      };

      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: planWithoutDescription,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlanDetailById('4').subscribe(response => {
        expect(response).toEqual(planWithoutDescription);
        expect(service.subscriptionPlanDetail()).toEqual(
          planWithoutDescription
        );
      });
    });
  });

  describe('API URL construction', () => {
    it('should use correct base URL for subscription plans', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockSubscriptionPlans,
          count: mockSubscriptionPlans.length,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlans(params).subscribe();

      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining('/subscription-plans'),
        params,
        { loadingKey: 'get-subscription-plans' }
      );
    });

    it('should use correct URL for subscription plan detail', () => {
      const id = '123';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockSubscriptionPlanDetail,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSubscriptionPlanDetailById(id).subscribe();

      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining(`/subscription-plans/${id}`)
      );
    });

    it('should use correct URL for create subscription plan', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.post).mockReturnValue(of(mockResponse));

      service.createSubscriptionPlan(mockSubscriptionPlanRequest).subscribe();

      expect(requestService.post).toHaveBeenCalledWith(
        expect.stringContaining('/subscription-plans'),
        mockSubscriptionPlanRequest
      );
    });

    it('should use correct URL for update subscription plan', () => {
      const id = '456';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service
        .updateSubscriptionPlan(mockSubscriptionPlanRequest, id)
        .subscribe();

      expect(requestService.put).toHaveBeenCalledWith(
        expect.stringContaining(`/subscription-plans/${id}`),
        mockSubscriptionPlanRequest
      );
    });

    it('should use correct URL for activate subscription plan', () => {
      const id = '789';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateSubscriptionPlan(id).subscribe();

      expect(requestService.put).toHaveBeenCalledWith(
        expect.stringContaining(`/subscription-plans/${id}/activate`),
        '',
        { loadingKey: 'activate-subscription-plan' }
      );
    });

    it('should use correct URL for archive subscription plan', () => {
      const id = '101';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveSubscriptionPlan(id).subscribe();

      expect(requestService.put).toHaveBeenCalledWith(
        expect.stringContaining(`/subscription-plans/${id}/archive`),
        '',
        { loadingKey: 'archive-subscription-plan' }
      );
    });
  });
});
