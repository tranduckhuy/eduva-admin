import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { CreditPackService } from './credit-pack.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { CreditPack } from '../model/credit-pack.model';
import { CreditPackRequest } from '../model/credit-pack-request.model';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { EntityListResponse } from '../../../shared/models/api/response/query/entity-list-response.model';

describe('CreditPackService', () => {
  let service: CreditPackService;
  let requestService: RequestService;
  let toastService: ToastHandlingService;

  const mockCreditPacks: CreditPack[] = [
    {
      id: 1,
      name: 'Basic Credit Pack',
      price: 50000,
      credits: 100,
      bonusCredits: 10,
      status: 0,
    },
    {
      id: 2,
      name: 'Premium Credit Pack',
      price: 100000,
      credits: 250,
      bonusCredits: 50,
      status: 0,
    },
    {
      id: 3,
      name: 'Enterprise Credit Pack',
      price: 200000,
      credits: 600,
      bonusCredits: 150,
      status: 1,
    },
  ];

  const mockCreditPackDetail: CreditPack = {
    id: 1,
    name: 'Basic Credit Pack',
    price: 50000,
    credits: 100,
    bonusCredits: 10,
    status: 0,
  };

  const mockCreditPackRequest: CreditPackRequest = {
    name: 'New Credit Pack',
    price: 75000,
    credits: 150,
    bonusCredits: 25,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CreditPackService,
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
            error: vi.fn(),
            errorGeneral: vi.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(CreditPackService);
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
      expect(service.creditPacks()).toEqual([]);
      expect(service.totalCreditPack()).toEqual(0);
      expect(service.creditPackDetail()).toBeNull();
    });
  });

  describe('getCreditPacks', () => {
    it('should fetch credit packs and update signals on success', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockCreditPacks,
          count: mockCreditPacks.length,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPacks(params).subscribe(response => {
        expect(response).toEqual({
          data: mockCreditPacks,
          count: mockCreditPacks.length,
        });
        expect(service.creditPacks()).toEqual(mockCreditPacks);
        expect(service.totalCreditPack()).toEqual(mockCreditPacks.length);
      });
    });

    it('should reset credit packs and show error on non-success status', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPacks(params).subscribe(response => {
        expect(response).toBeNull();
        expect(service.creditPacks()).toEqual([]);
        expect(service.totalCreditPack()).toEqual(0);
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const error = new Error('Test error');

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getCreditPacks(params).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('getCreditPackDetailById', () => {
    it('should fetch credit pack detail and update signal on success', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockCreditPackDetail,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPackDetailById(id).subscribe(response => {
        expect(response).toEqual(mockCreditPackDetail);
        expect(service.creditPackDetail()).toEqual(mockCreditPackDetail);
      });
    });

    it('should reset credit pack detail and show error on non-success status', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPackDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(service.creditPackDetail()).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getCreditPackDetailById(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('createCreditPack', () => {
    it('should create credit pack and navigate on success', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.post).mockReturnValue(of(mockResponse));

      service.createCreditPack(mockCreditPackRequest).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Gói credit đã được tạo mới thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.post).mockReturnValue(of(mockResponse));

      service.createCreditPack(mockCreditPackRequest).subscribe(() => {
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

      service.createCreditPack(mockCreditPackRequest).subscribe(() => {
        expect(toastService.error).toHaveBeenCalledWith(
          'Thông tin cung cấp không hợp lệ',
          'Tên gói credit đã tồn tại. Vui lòng chọn tên khác!'
        );
      });
    });

    it('should handle other errors', () => {
      // Use HttpErrorResponse with error property but no statusCode
      const error = new HttpErrorResponse({ error: {} });

      vi.mocked(requestService.post).mockReturnValue(throwError(() => error));

      service.createCreditPack(mockCreditPackRequest).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('updateCredit', () => {
    it('should show success message on successful update', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.updateCredit(mockCreditPackRequest, id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Gói credit cập nhật thông tin thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.updateCredit(mockCreditPackRequest, id).subscribe(() => {
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

      service.updateCredit(mockCreditPackRequest, id).subscribe(() => {
        expect(toastService.error).toHaveBeenCalledWith(
          'Thông tin cung cấp không hợp lệ',
          'Tên gói credit đã tồn tại. Vui lòng chọn tên khác!'
        );
      });
    });

    it('should handle other errors', () => {
      // Use HttpErrorResponse with error property but no statusCode
      const id = '1';
      const error = new HttpErrorResponse({ error: {} });

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.updateCredit(mockCreditPackRequest, id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('activateCreditPack', () => {
    it('should show success message on successful activation', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateCreditPack(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Kích hoạt gói credit thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateCreditPack(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return void', () => {
      const id = '1';
      const error = new Error('Test error');

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.activateCreditPack(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('archiveCreditPack', () => {
    it('should show success message on successful archiving', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveCreditPack(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Vô hiệu hóa gói credit thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveCreditPack(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return void', () => {
      const id = '1';
      const error = new Error('Test error');

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.archiveCreditPack(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('signal management', () => {
    it('should expose readonly signals', () => {
      expect(typeof service.creditPacks).toBe('function');
      expect(typeof service.totalCreditPack).toBe('function');
      expect(typeof service.creditPackDetail).toBe('function');
    });

    it('should update signals reactively', () => {
      const initialPacks = service.creditPacks();
      const initialTotal = service.totalCreditPack();

      service['creditPacksSignal'].set(mockCreditPacks);
      service['totalCreditPackSignal'].set(mockCreditPacks.length);

      expect(service.creditPacks()).toEqual(mockCreditPacks);
      expect(service.totalCreditPack()).toEqual(mockCreditPacks.length);
      expect(service.creditPacks()).not.toEqual(initialPacks);
      expect(service.totalCreditPack()).not.toEqual(initialTotal);
    });
  });

  describe('reset methods', () => {
    it('should reset credit packs signal', () => {
      // Set initial data
      service['creditPacksSignal'].set(mockCreditPacks);
      service['totalCreditPackSignal'].set(mockCreditPacks.length);

      service['resetCreditPacks']();

      expect(service.creditPacks()).toEqual([]);
      expect(service.totalCreditPack()).toEqual(0);
    });

    it('should reset credit pack detail signal', () => {
      // Set initial data
      service['creditPackDetailSignal'].set(mockCreditPackDetail);

      service['resetCreditPackDetail']();

      expect(service.creditPackDetail()).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle null response data', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: null,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPackDetailById('1').subscribe(response => {
        expect(response).toBeNull();
      });
    });

    it('should handle undefined response data', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPackDetailById('1').subscribe(response => {
        expect(response).toBeNull();
      });
    });

    it('should handle empty credit packs list', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: [],
          count: 0,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPacks(params).subscribe(response => {
        expect(response).toEqual({
          data: [],
          count: 0,
        });
        expect(service.creditPacks()).toEqual([]);
        expect(service.totalCreditPack()).toEqual(0);
      });
    });

    it('should handle credit pack with zero bonus credits', () => {
      const creditPackWithZeroBonus: CreditPack = {
        id: 4,
        name: 'No Bonus Pack',
        price: 25000,
        credits: 50,
        bonusCredits: 0,
        status: 0,
      };

      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: creditPackWithZeroBonus,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPackDetailById('4').subscribe(response => {
        expect(response).toEqual(creditPackWithZeroBonus);
        expect(service.creditPackDetail()).toEqual(creditPackWithZeroBonus);
      });
    });
  });

  describe('API URL construction', () => {
    it('should use correct base URL for credit packs', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockCreditPacks,
          count: mockCreditPacks.length,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPacks(params).subscribe();

      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining('/credit-packs'),
        params,
        { loadingKey: 'get-credit-packs' }
      );
    });

    it('should use correct URL for credit pack detail', () => {
      const id = '123';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockCreditPackDetail,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCreditPackDetailById(id).subscribe();

      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining(`/credit-packs/${id}`)
      );
    });

    it('should use correct URL for create credit pack', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.post).mockReturnValue(of(mockResponse));

      service.createCreditPack(mockCreditPackRequest).subscribe();

      expect(requestService.post).toHaveBeenCalledWith(
        expect.stringContaining('/credit-packs'),
        mockCreditPackRequest
      );
    });

    it('should use correct URL for update credit pack', () => {
      const id = '456';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.updateCredit(mockCreditPackRequest, id).subscribe();

      expect(requestService.put).toHaveBeenCalledWith(
        expect.stringContaining(`/credit-packs/${id}`),
        mockCreditPackRequest
      );
    });

    it('should use correct URL for activate credit pack', () => {
      const id = '789';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateCreditPack(id).subscribe();

      expect(requestService.put).toHaveBeenCalledWith(
        expect.stringContaining(`/credit-packs/${id}/activate`),
        '',
        { loadingKey: 'activate-credit-pack' }
      );
    });

    it('should use correct URL for archive credit pack', () => {
      const id = '101';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveCreditPack(id).subscribe();

      expect(requestService.put).toHaveBeenCalledWith(
        expect.stringContaining(`/credit-packs/${id}/archive`),
        '',
        { loadingKey: 'archive-credit-pack' }
      );
    });
  });
});
