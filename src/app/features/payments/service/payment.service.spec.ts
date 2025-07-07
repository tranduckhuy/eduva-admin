import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError, EMPTY } from 'rxjs';

import { PaymentService } from './payment.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { Payment } from '../model/payment.model';
import { PaymentListParams } from '../model/payment-list-params';
import { EntityListResponse } from '../../../shared/models/api/response/query/entity-list-response.model';
import { SchoolSubscriptionDetail } from '../model/school-subscription-detail.model';
import { CreditTransactionDetail } from '../model/credit-transaction-detail';

describe('PaymentService', () => {
  let service: PaymentService;
  let requestService: RequestService;
  let toastService: ToastHandlingService;

  const mockPayments: Payment[] = [
    {
      id: '1',
      transactionCode: 'TXN1',
      amount: 100,
      paymentItemId: 10,
      paymentPurpose: 0,
      paymentMethod: 0,
      paymentStatus: 0,
      createdAt: '2024-01-01',
      user: { id: 'u1', fullName: 'User 1', phoneNumber: '', email: '' },
    },
    {
      id: '2',
      transactionCode: 'TXN2',
      amount: 200,
      paymentItemId: 20,
      paymentPurpose: 1,
      paymentMethod: 1,
      paymentStatus: 1,
      createdAt: '2024-01-02',
      user: { id: 'u2', fullName: 'User 2', phoneNumber: '', email: '' },
    },
  ];
  const mockSchoolSubscriptionDetail: SchoolSubscriptionDetail = {
    id: 'sub1',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    subscriptionStatus: 0,
    billingCycle: 0,
    createdAt: '2024-01-01',
    school: {
      id: 's1',
      name: 'School 1',
      address: '',
      contactEmail: '',
      contactPhone: '',
      websiteUrl: '',
    },
    plan: {
      id: 'p1',
      name: 'Plan 1',
      description: '',
      maxUsers: 10,
      storageLimitGB: 5,
      price: 100,
    },
    paymentTransaction: {
      id: 'pt1',
      transactionCode: 'TXN3',
      amount: 100,
      paymentItemId: 30,
      paymentPurpose: 0,
      paymentMethod: 0,
      paymentStatus: 0,
      createdAt: '2024-01-01',
      user: { id: 'u1', fullName: 'User 1', phoneNumber: '', email: '' },
    },
    user: { id: 'u1', fullName: 'User 1', phoneNumber: '', email: '' },
  };
  const mockCreditTransactionDetail: CreditTransactionDetail = {
    id: 'ct1',
    credits: 100,
    createdAt: '2024-01-01',
    user: { id: 'u1', fullName: 'User 1', email: '', phoneNumber: '' },
    aiCreditPack: {
      id: 1,
      name: 'Pack 1',
      price: 100,
      credits: 100,
      bonusCredits: 10,
    },
    paymentTransactionId: 'pt1',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentService,
        {
          provide: RequestService,
          useValue: {
            get: vi.fn(),
          },
        },
        {
          provide: ToastHandlingService,
          useValue: {
            error: vi.fn(),
            errorGeneral: vi.fn(),
          },
        },
        { provide: 'Router', useValue: {} },
      ],
    });
    service = TestBed.inject(PaymentService);
    requestService = TestBed.inject(RequestService);
    toastService = TestBed.inject(ToastHandlingService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty initial signals', () => {
      expect(service.payments()).toEqual([]);
      expect(service.totalPayments()).toEqual(0);
      expect(service.schoolSubscriptionDetail()).toBeNull();
      expect(service.creditTransactionDetail()).toBeNull();
    });
  });

  describe('getPayments', () => {
    it('should fetch payments and update signals on success', () => {
      const params: PaymentListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockPayments,
          count: mockPayments.length,
        },
      };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getPayments(params).subscribe(response => {
        expect(response).toEqual({
          data: mockPayments,
          count: mockPayments.length,
        });
        expect(service.payments()).toEqual(mockPayments);
        expect(service.totalPayments()).toEqual(mockPayments.length);
      });
    });
    it('should reset payments and show error on non-success status', () => {
      const params: PaymentListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getPayments(params).subscribe(response => {
        expect(response).toBeNull();
        expect(service.payments()).toEqual([]);
        expect(service.totalPayments()).toEqual(0);
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
    it('should handle error and return EMPTY', () => {
      const params: PaymentListParams = { pageIndex: 1, pageSize: 10 };
      const error = new Error('Test error');
      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));
      service.getPayments(params).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('getSchoolSubscriptionDetailById', () => {
    it('should fetch school subscription detail and update signal on success', () => {
      const id = 'sub1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockSchoolSubscriptionDetail,
      };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getSchoolSubscriptionDetailById(id).subscribe(response => {
        expect(response).toEqual(mockSchoolSubscriptionDetail);
        expect(service.schoolSubscriptionDetail()).toEqual(
          mockSchoolSubscriptionDetail
        );
      });
    });
    it('should reset school subscription detail and show error on non-success status', () => {
      const id = 'sub1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getSchoolSubscriptionDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(service.schoolSubscriptionDetail()).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
    it('should handle error and return EMPTY', () => {
      const id = 'sub1';
      const error = new Error('Test error');
      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));
      service.getSchoolSubscriptionDetailById(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('getCreditTransactionDetailById', () => {
    it('should fetch credit transaction detail and update signal on success', () => {
      const id = 'ct1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockCreditTransactionDetail,
      };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getCreditTransactionDetailById(id).subscribe(response => {
        expect(response).toEqual(mockCreditTransactionDetail);
        expect(service.creditTransactionDetail()).toEqual(
          mockCreditTransactionDetail
        );
      });
    });
    it('should reset credit transaction detail and show error on non-success status', () => {
      const id = 'ct1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getCreditTransactionDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(service.creditTransactionDetail()).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
    it('should handle error and return EMPTY', () => {
      const id = 'ct1';
      const error = new Error('Test error');
      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));
      service.getCreditTransactionDetailById(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('signal management', () => {
    it('should expose readonly signals', () => {
      expect(typeof service.payments).toBe('function');
      expect(typeof service.totalPayments).toBe('function');
      expect(typeof service.schoolSubscriptionDetail).toBe('function');
      expect(typeof service.creditTransactionDetail).toBe('function');
    });
    it('should update signals reactively', () => {
      const initialPayments = service.payments();
      const initialTotal = service.totalPayments();
      service['paymentsSignal'].set(mockPayments);
      service['totalPaymentsSignal'].set(mockPayments.length);
      expect(service.payments()).toEqual(mockPayments);
      expect(service.totalPayments()).toEqual(mockPayments.length);
      expect(service.payments()).not.toEqual(initialPayments);
      expect(service.totalPayments()).not.toEqual(initialTotal);
    });
  });

  describe('reset methods', () => {
    it('should reset payments signal', () => {
      service['paymentsSignal'].set(mockPayments);
      service['totalPaymentsSignal'].set(mockPayments.length);
      service['resetPayments']();
      expect(service.payments()).toEqual([]);
      expect(service.totalPayments()).toEqual(0);
    });
    it('should reset school subscription detail signal', () => {
      service['schoolSubscriptionDetailSignal'].set(
        mockSchoolSubscriptionDetail
      );
      service['resetPayment']();
      expect(service.schoolSubscriptionDetail()).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle null response data for getPayments', () => {
      const params: PaymentListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = { statusCode: StatusCode.SUCCESS, data: null };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getPayments(params).subscribe(response => {
        expect(response).toBeNull();
      });
    });
    it('should handle undefined response data for getSchoolSubscriptionDetailById', () => {
      const id = 'sub1';
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getSchoolSubscriptionDetailById(id).subscribe(response => {
        expect(response).toBeNull();
      });
    });
    it('should handle undefined response data for getCreditTransactionDetailById', () => {
      const id = 'ct1';
      const mockResponse = { statusCode: StatusCode.SUCCESS };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getCreditTransactionDetailById(id).subscribe(response => {
        expect(response).toBeNull();
      });
    });
    it('should handle empty payments list', () => {
      const params: PaymentListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: { data: [], count: 0 },
      };
      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));
      service.getPayments(params).subscribe(response => {
        expect(response).toEqual({ data: [], count: 0 });
        expect(service.payments()).toEqual([]);
        expect(service.totalPayments()).toEqual(0);
      });
    });
  });
});
