import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, EMPTY } from 'rxjs';

import { SchoolService } from './school.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { School } from '../model/school-model';
import { SchoolDetail } from '../model/school-detail-model';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { EntityListResponse } from '../../../shared/models/api/response/query/entity-list-response.model';

describe('SchoolService', () => {
  let service: SchoolService;
  let requestService: RequestService;
  let toastService: ToastHandlingService;

  const mockSchools: School[] = [
    {
      id: 1,
      name: 'Test School 1',
      contactEmail: 'school1@test.com',
      contactPhone: '123-456-7890',
      address: '123 Test Street, City 1',
      websiteUrl: 'http://school1.test.com',
      status: 0,
    },
    {
      id: 2,
      name: 'Test School 2',
      contactEmail: 'school2@test.com',
      contactPhone: '098-765-4321',
      address: '456 Test Avenue, City 2',
      websiteUrl: 'http://school2.test.com',
      status: 1,
    },
    {
      id: 3,
      name: 'Test School 3',
      contactEmail: 'school3@test.com',
      contactPhone: '555-123-4567',
      address: '789 Test Boulevard, City 3',
      status: 0,
    },
  ];

  const mockSchoolDetail: SchoolDetail = {
    id: 1,
    name: 'Test School 1',
    contactEmail: 'school1@test.com',
    contactPhone: '123-456-7890',
    address: '123 Test Street, City 1',
    websiteUrl: 'http://school1.test.com',
    status: 0,
    schoolAdminId: 'admin-1',
    schoolAdminFullName: 'John Doe',
    schoolAdminEmail: 'john.doe@school1.test.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SchoolService,
        {
          provide: RequestService,
          useValue: {
            get: vi.fn(),
            put: vi.fn(),
          },
        },
        {
          provide: ToastHandlingService,
          useValue: {
            success: vi.fn(),
            errorGeneral: vi.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(SchoolService);
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
      expect(service.schools()).toEqual([]);
      expect(service.totalSchools()).toEqual(0);
      expect(service.schoolDetail()).toBeNull();
    });
  });

  describe('getSchools', () => {
    it('should fetch schools and update signals on success', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockSchools,
          count: mockSchools.length,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchools(params).subscribe(response => {
        expect(response).toEqual({
          data: mockSchools,
          count: mockSchools.length,
        });
        expect(service.schools()).toEqual(mockSchools);
        expect(service.totalSchools()).toEqual(mockSchools.length);
      });
    });

    it('should reset schools and show error on non-success status', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchools(params).subscribe(response => {
        expect(response).toBeNull();
        expect(service.schools()).toEqual([]);
        expect(service.totalSchools()).toEqual(0);
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getSchools(params).subscribe({
        next: () => {
          nextCalled = true;
        },
        error: () => {
          expect(nextCalled).toBe(false);
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('getSchoolDetailById', () => {
    it('should fetch school detail and update signal on success', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockSchoolDetail,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchoolDetailById(id).subscribe(response => {
        expect(response).toEqual(mockSchoolDetail);
        expect(service.schoolDetail()).toEqual(mockSchoolDetail);
      });
    });

    it('should reset school detail and show error on non-success status', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchoolDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(service.schoolDetail()).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getSchoolDetailById(id).subscribe({
        next: () => {
          nextCalled = true;
        },
        error: () => {
          expect(nextCalled).toBe(false);
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('activateSchool', () => {
    it('should show success message on successful activation', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateSchool(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Kích hoạt trường học thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateSchool(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.activateSchool(id).subscribe({
        next: () => {
          nextCalled = true;
        },
        error: () => {
          expect(nextCalled).toBe(false);
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('archiveSchool', () => {
    it('should show success message on successful archiving', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveSchool(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Vô hiệu hóa trường học thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveSchool(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.archiveSchool(id).subscribe({
        next: () => {
          nextCalled = true;
        },
        error: () => {
          expect(nextCalled).toBe(false);
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('signal management', () => {
    it('should expose readonly signals', () => {
      expect(typeof service.schools).toBe('function');
      expect(typeof service.totalSchools).toBe('function');
      expect(typeof service.schoolDetail).toBe('function');
    });

    it('should update signals reactively', () => {
      const initialSchools = service.schools();
      const initialTotal = service.totalSchools();

      service['schoolsSignal'].set(mockSchools);
      service['totalSchoolsSignal'].set(mockSchools.length);

      expect(service.schools()).toEqual(mockSchools);
      expect(service.totalSchools()).toEqual(mockSchools.length);
      expect(service.schools()).not.toEqual(initialSchools);
      expect(service.totalSchools()).not.toEqual(initialTotal);
    });
  });

  describe('reset methods', () => {
    it('should reset schools signal', () => {
      // Set initial data
      service['schoolsSignal'].set(mockSchools);
      service['totalSchoolsSignal'].set(mockSchools.length);

      service['resetSchools']();

      expect(service.schools()).toEqual([]);
      expect(service.totalSchools()).toEqual(0);
    });

    it('should reset school detail signal', () => {
      // Set initial data
      service['schoolDetailSignal'].set(mockSchoolDetail);

      service['resetSchool']();

      expect(service.schoolDetail()).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle null response data', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: null,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchoolDetailById('1').subscribe(response => {
        expect(response).toBeNull();
      });
    });

    it('should handle undefined response data', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchoolDetailById('1').subscribe(response => {
        expect(response).toBeNull();
      });
    });

    it('should handle empty schools list', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: [],
          count: 0,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchools(params).subscribe(response => {
        expect(response).toEqual({
          data: [],
          count: 0,
        });
        expect(service.schools()).toEqual([]);
        expect(service.totalSchools()).toEqual(0);
      });
    });

    it('should handle school without websiteUrl', () => {
      const schoolWithoutWebsite: School = {
        id: 4,
        name: 'School Without Website',
        contactEmail: 'noweb@test.com',
        contactPhone: '111-222-3333',
        address: 'No Website Street',
        status: 0,
      };

      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: schoolWithoutWebsite,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchoolDetailById('4').subscribe(response => {
        expect(response).toEqual(schoolWithoutWebsite);
        expect(service.schoolDetail()).toEqual(schoolWithoutWebsite);
      });
    });
  });

  describe('API URL construction', () => {
    it('should use correct base URL for schools', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockSchools,
          count: mockSchools.length,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchools(params).subscribe();

      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining('/schools'),
        params,
        { loadingKey: 'get-schools' }
      );
    });

    it('should use correct URL for school detail', () => {
      const id = '123';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockSchoolDetail,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getSchoolDetailById(id).subscribe();

      expect(requestService.get).toHaveBeenCalledWith(
        expect.stringContaining(`/schools/${id}`)
      );
    });

    it('should use correct URL for activate school', () => {
      const id = '456';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateSchool(id).subscribe();

      expect(requestService.put).toHaveBeenCalledWith(
        expect.stringContaining(`/schools/${id}/activate`),
        '',
        { loadingKey: 'activate-school' }
      );
    });

    it('should use correct URL for archive school', () => {
      const id = '789';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveSchool(id).subscribe();

      expect(requestService.put).toHaveBeenCalledWith(
        expect.stringContaining(`/schools/${id}/archive`),
        '',
        { loadingKey: 'archive-school' }
      );
    });
  });
});
