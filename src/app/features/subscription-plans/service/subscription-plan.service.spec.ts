import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { SubscriptionPlanService } from './subscription-plan.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { SubscriptionPlan } from '../model/subscription-plan.model';
import { SubscriptionPlanRequest } from '../model/subscription-plan-request.model';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';

describe('SubscriptionPlanService', () => {
  let service: SubscriptionPlanService;
  let httpMock: HttpTestingController;
  let requestService: RequestService;
  let toastService: ToastHandlingService;
  let router: Router;

  const mockSubscriptionPlans: SubscriptionPlan[] = [
    {
      id: 1,
      description: 'Description 1',
      maxUsers: 1,
      name: 'Name 1',
      priceMonthly: 1,
      pricePerYear: 1,
      status: 0,
      storageLimitGB: 1,
    },
    {
      id: 2,
      description: 'Description 2',
      maxUsers: 2,
      name: 'Name 2',
      priceMonthly: 2,
      pricePerYear: 2,
      status: 0,
      storageLimitGB: 2,
    },
  ];

  const mockSubscriptionPlanDetail: SubscriptionPlan = {
    id: 1,
    description: 'Description 1',
    maxUsers: 1,
    name: 'Name 1',
    priceMonthly: 1,
    pricePerYear: 1,
    status: 0,
    storageLimitGB: 1,
  };

  const mockSubscriptionPlanRequest: SubscriptionPlanRequest = {
    description: 'Description 1',
    maxUsers: 1,
    name: 'Name 1',
    priceMonthly: 1,
    pricePerYear: 1,
    storageLimitGB: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        SubscriptionPlanService,
        RequestService,
        ToastHandlingService,
      ],
    });

    service = TestBed.inject(SubscriptionPlanService);
    httpMock = TestBed.inject(HttpTestingController);
    requestService = TestBed.inject(RequestService);
    toastService = TestBed.inject(ToastHandlingService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSubscriptionPlans', () => {
    it('should fetch Subscription plans and update signals on success', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockSubscriptionPlans,
          count: mockSubscriptionPlans.length,
        },
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

      service.getSubscriptionPlans(params).subscribe(response => {
        expect(response).toEqual(mockResponse.data);
        expect(service.subscriptionPlans()).toEqual(mockSubscriptionPlans);
        expect(service.totalSubscriptionPlans()).toEqual(
          mockSubscriptionPlans.length
        );
      });
    });

    it('should reset Subscription plans and show error on non-success status', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(service as any, 'resetSubscriptionPlans').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getSubscriptionPlans(params).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetSubscriptionPlans).toHaveBeenCalled();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return null', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const error = new Error('Test error');

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(service as any, 'resetSubscriptionPlans').and.callThrough();

      service.getSubscriptionPlans(params).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetSubscriptionPlans).toHaveBeenCalled();
      });
    });
  });

  describe('getSubscriptionPlanDetailById', () => {
    it('should fetch Subscription plan detail and update signal on success', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockSubscriptionPlanDetail,
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

      service.getSubscriptionPlanDetailById(id).subscribe(response => {
        expect(response).toEqual(mockSubscriptionPlanDetail);
        expect(service.subscriptionPlanDetail()).toEqual(
          mockSubscriptionPlanDetail
        );
      });
    });

    it('should reset Subscription plan detail and show error on non-success status', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(service as any, 'resetSubscriptionPlanDetail').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getSubscriptionPlanDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetSubscriptionPlanDetail).toHaveBeenCalled();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle 404 error and navigate to Subscription-plans', () => {
      const id = '1';
      const error = {
        error: {
          statusCode: StatusCode.PLAN_NOT_FOUND,
        },
      };

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(router, 'navigateByUrl');
      spyOn(toastService, 'error');

      service.getSubscriptionPlanDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(router.navigateByUrl).toHaveBeenCalledWith('Subscription-plans');
        expect(toastService.error).toHaveBeenCalledWith(
          'Không tìm thấy dữ liệu',
          'Gói đăng ký không tồn tại!'
        );
      });
    });

    it('should handle other errors and show general error', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(toastService, 'errorGeneral');

      service.getSubscriptionPlanDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('createSubscriptionPlan', () => {
    it('should create Subscription plan and navigate on success', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'post').and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');
      spyOn(toastService, 'success');

      service
        .createSubscriptionPlan(mockSubscriptionPlanRequest)
        .subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith(
            'Subscription-plans'
          );
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

      spyOn(requestService, 'post').and.returnValue(of(mockResponse));
      spyOn(toastService, 'errorGeneral');

      service
        .createSubscriptionPlan(mockSubscriptionPlanRequest)
        .subscribe(() => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        });
    });

    it('should handle invalid information error', () => {
      const error = {
        error: {
          statusCode: StatusCode.PROVIDED_INFORMATION_IS_INVALID,
        },
      };

      spyOn(requestService, 'post').and.returnValue(throwError(error));
      spyOn(toastService, 'error');

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
      const error = new Error('Test error');

      spyOn(requestService, 'post').and.returnValue(throwError(error));
      spyOn(toastService, 'errorGeneral');

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

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

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

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'errorGeneral');

      service
        .updateSubscriptionPlan(mockSubscriptionPlanRequest, id)
        .subscribe(() => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        });
    });

    it('should handle invalid information error', () => {
      const id = '1';
      const error = {
        error: {
          statusCode: StatusCode.PROVIDED_INFORMATION_IS_INVALID,
        },
      };

      spyOn(requestService, 'put').and.returnValue(throwError(error));
      spyOn(toastService, 'error');

      service
        .updateSubscriptionPlan(mockSubscriptionPlanRequest, id)
        .subscribe(() => {
          expect(toastService.error).toHaveBeenCalledWith(
            'Thông tin cung cấp không hợp lệ',
            'Tên gói đăng ký đã tồn tại. Vui lòng chọn tên khác!'
          );
        });
    });

    it('should handle other errors', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));
      spyOn(toastService, 'errorGeneral');

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

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

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

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'errorGeneral');

      service.activateSubscriptionPlan(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));

      service.activateSubscriptionPlan(id).subscribe();
    });
  });

  describe('archiveSubscriptionPlan', () => {
    it('should show success message on successful archiving', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

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

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'errorGeneral');

      service.archiveSubscriptionPlan(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));

      service.archiveSubscriptionPlan(id).subscribe();
    });
  });

  describe('reset methods', () => {
    it('should reset Subscription plans signal', () => {
      (service as any).SubscriptionPlansSignal.set(mockSubscriptionPlans);
      (service as any).totalSubscriptionPlansSignal.set(
        mockSubscriptionPlans.length
      );

      (service as any).resetSubscriptionPlans();

      expect(service.subscriptionPlans()).toEqual([]);
      expect(service.totalSubscriptionPlans()).toEqual(0);
    });

    it('should reset Subscription plan detail signal', () => {
      (service as any).SubscriptionPlanDetailSignal.set(
        mockSubscriptionPlanDetail
      );

      (service as any).resetSubscriptionPlanDetail();

      expect(service.subscriptionPlanDetail()).toBeNull();
    });
  });
});
