import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { PricingPlanService } from './pricing-plan.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { PricingPlan } from '../model/pricing-plan.model';
import { PricingPlanRequest } from '../model/pricing-plan-request.model';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';

describe('PricingPlanService', () => {
  let service: PricingPlanService;
  let httpMock: HttpTestingController;
  let requestService: RequestService;
  let toastService: ToastHandlingService;
  let router: Router;

  const mockPricingPlans: PricingPlan[] = [
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

  const mockPricingPlanDetail: PricingPlan = {
    id: 1,
    description: 'Description 1',
    maxUsers: 1,
    name: 'Name 1',
    priceMonthly: 1,
    pricePerYear: 1,
    status: 0,
    storageLimitGB: 1,
  };

  const mockPricingPlanRequest: PricingPlanRequest = {
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
      providers: [PricingPlanService, RequestService, ToastHandlingService],
    });

    service = TestBed.inject(PricingPlanService);
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

  describe('getPricingPlans', () => {
    it('should fetch pricing plans and update signals on success', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockPricingPlans,
          count: mockPricingPlans.length,
        },
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

      service.getPricingPlans(params).subscribe(response => {
        expect(response).toEqual(mockResponse.data);
        expect(service.pricingPlans()).toEqual(mockPricingPlans);
        expect(service.totalPricingPlans()).toEqual(mockPricingPlans.length);
      });
    });

    it('should reset pricing plans and show error on non-success status', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(service as any, 'resetPricingPlans').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getPricingPlans(params).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetPricingPlans).toHaveBeenCalled();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return null', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const error = new Error('Test error');

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(service as any, 'resetPricingPlans').and.callThrough();

      service.getPricingPlans(params).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetPricingPlans).toHaveBeenCalled();
      });
    });
  });

  describe('getPricingPlanDetailById', () => {
    it('should fetch pricing plan detail and update signal on success', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockPricingPlanDetail,
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

      service.getPricingPlanDetailById(id).subscribe(response => {
        expect(response).toEqual(mockPricingPlanDetail);
        expect(service.pricingPlanDetail()).toEqual(mockPricingPlanDetail);
      });
    });

    it('should reset pricing plan detail and show error on non-success status', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(service as any, 'resetPricingPlanDetail').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getPricingPlanDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetPricingPlanDetail).toHaveBeenCalled();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle 404 error and navigate to pricing-plans', () => {
      const id = '1';
      const error = {
        error: {
          statusCode: StatusCode.PLAN_NOT_FOUND,
        },
      };

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(router, 'navigateByUrl');
      spyOn(toastService, 'error');

      service.getPricingPlanDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(router.navigateByUrl).toHaveBeenCalledWith('pricing-plans');
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

      service.getPricingPlanDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('createPricingPlan', () => {
    it('should create pricing plan and navigate on success', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'post').and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');
      spyOn(toastService, 'success');

      service.createPricingPlan(mockPricingPlanRequest).subscribe(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('pricing-plans');
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

      service.createPricingPlan(mockPricingPlanRequest).subscribe(() => {
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

      service.createPricingPlan(mockPricingPlanRequest).subscribe(() => {
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

      service.createPricingPlan(mockPricingPlanRequest).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('updatePricingPlan', () => {
    it('should show success message on successful update', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

      service.updatePricingPlan(mockPricingPlanRequest, id).subscribe(() => {
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

      service.updatePricingPlan(mockPricingPlanRequest, id).subscribe(() => {
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

      service.updatePricingPlan(mockPricingPlanRequest, id).subscribe(() => {
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

      service.updatePricingPlan(mockPricingPlanRequest, id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('activatePricingPlan', () => {
    it('should show success message on successful activation', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

      service.activatePricingPlan(id).subscribe(() => {
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

      service.activatePricingPlan(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));

      service.activatePricingPlan(id).subscribe();
    });
  });

  describe('archivePricingPlan', () => {
    it('should show success message on successful archiving', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

      service.archivePricingPlan(id).subscribe(() => {
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

      service.archivePricingPlan(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));

      service.archivePricingPlan(id).subscribe();
    });
  });

  describe('reset methods', () => {
    it('should reset pricing plans signal', () => {
      (service as any).pricingPlansSignal.set(mockPricingPlans);
      (service as any).totalPricingPlansSignal.set(mockPricingPlans.length);

      (service as any).resetPricingPlans();

      expect(service.pricingPlans()).toEqual([]);
      expect(service.totalPricingPlans()).toEqual(0);
    });

    it('should reset pricing plan detail signal', () => {
      (service as any).pricingPlanDetailSignal.set(mockPricingPlanDetail);

      (service as any).resetPricingPlanDetail();

      expect(service.pricingPlanDetail()).toBeNull();
    });
  });
});
