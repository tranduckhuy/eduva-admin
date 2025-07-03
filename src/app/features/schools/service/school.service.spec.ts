import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SchoolService } from './school.service';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { School } from '../model/school-model';
import { SchoolDetail } from '../model/school-detail-model';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { of, throwError } from 'rxjs';

describe('SchoolService', () => {
  let service: SchoolService;
  let httpMock: HttpTestingController;
  let requestService: RequestService;
  let toastService: ToastHandlingService;
  let router: Router;

  const mockSchools: School[] = [
    {
      id: 1,
      name: 'School 1',
      address: 'Address 1',
      contactPhone: '123',
      contactEmail: 'school1@test.com',
      status: 0,
    },
    {
      id: 2,
      name: 'School 2',
      address: 'Address 2',
      contactPhone: '456',
      contactEmail: 'school2@test.com',
      status: 3,
    },
  ];

  const mockSchoolDetail: SchoolDetail = {
    id: 1,
    name: 'School 1',
    address: 'Address 1',
    contactPhone: '123',
    contactEmail: 'school1@test.com',
    status: 0,
    schoolAdminId: '1',
    schoolAdminFullName: 'school admin',
    schoolAdminEmail: 'test@gmail.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SchoolService, RequestService, ToastHandlingService],
    });

    service = TestBed.inject(SchoolService);
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

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

      service.getSchools(params).subscribe(response => {
        expect(response).toEqual(mockResponse.data);
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

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(service as any, 'resetSchools').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getSchools(params).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetSchools).toHaveBeenCalled();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return null', () => {
      const params: EntityListParams = { pageIndex: 1, pageSize: 10 };
      const error = new Error('Test error');

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(service as any, 'resetSchools').and.callThrough();

      service.getSchools(params).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetSchools).toHaveBeenCalled();
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

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

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

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(service as any, 'resetSchool').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getSchoolDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetSchool).toHaveBeenCalled();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle 404 error and navigate to schools', () => {
      const id = '1';
      const error = {
        error: {
          statusCode: StatusCode.SCHOOL_NOT_FOUND,
        },
      };

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(router, 'navigateByUrl');
      spyOn(toastService, 'error');

      service.getSchoolDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(router.navigateByUrl).toHaveBeenCalledWith('schools');
        expect(toastService.error).toHaveBeenCalledWith(
          'Không tìm thấy dữ liệu',
          'Trường học không tồn tại!'
        );
      });
    });

    it('should handle other errors and show general error', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(toastService, 'errorGeneral');

      service.getSchoolDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });
  });

  describe('activateSchool', () => {
    it('should show success message on successful activation', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

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

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'errorGeneral');

      service.activateSchool(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));

      service.activateSchool(id).subscribe();
    });
  });

  describe('archiveSchool', () => {
    it('should show success message on successful archiving', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

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

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'errorGeneral');

      service.archiveSchool(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));

      service.archiveSchool(id).subscribe();
    });
  });

  describe('reset methods', () => {
    it('should reset schools signal', () => {
      // Access private signal directly for testing
      (service as any).schoolsSignal.set(mockSchools);
      (service as any).totalSchoolsSignal.set(mockSchools.length);

      (service as any).resetSchools();

      expect(service.schools()).toEqual([]);
      expect(service.totalSchools()).toEqual(0);
    });

    it('should reset school detail signal', () => {
      (service as any).schoolDetailSignal.set(mockSchoolDetail);

      (service as any).resetSchool();

      expect(service.schoolDetail()).toBeNull();
    });
  });
});
