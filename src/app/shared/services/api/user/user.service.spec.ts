import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, EMPTY } from 'rxjs';

import { UserService } from './user.service';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';
import { User } from '../../../models/entities/user.model';
import { EntityListResponse } from '../../../models/api/response/query/entity-list-response.model';
import { UserListParams } from '../../../models/common/user-list-params';
import { School } from '../../../../features/schools/model/school-model';

describe('UserService', () => {
  let service: UserService;
  let requestService: RequestService;
  let toastService: ToastHandlingService;

  const schools: School[] = [
    {
      id: 1,
      name: 'Green Valley High School',
      contactEmail: 'info@greenvalleyhigh.edu',
      contactPhone: '123-456-7890',
      address: '123 Green St, Springfield, IL',
      websiteUrl: 'http://www.greenvalleyhigh.edu',
      status: 0,
    },
    {
      id: 2,
      name: 'Riverdale Academy',
      contactEmail: 'contact@riverdaleacademy.edu',
      contactPhone: '098-765-4321',
      address: '456 River Rd, Riverdale, NY',
      websiteUrl: 'http://www.riverdaleacademy.edu',
      status: 0,
    },
    {
      id: 3,
      name: 'Sunset Middle School',
      contactEmail: 'admin@sunsetmiddleschool.edu',
      contactPhone: '555-123-4567',
      address: '789 Sunset Blvd, Los Angeles, CA',
      websiteUrl: 'http://www.sunsetmiddleschool.edu',
      status: 1,
    },
  ];

  const mockUsers: User[] = [
    {
      id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5a',
      fullName: 'Alice Johnson',
      phoneNumber: '111-222-3333',
      email: 'alice.johnson@example.com',
      status: 0,
      avatarUrl: 'http://example.com/avatars/alice.jpg',
      school: schools[0],
      roles: ['SystemAdmin', 'SchoolAdmin'],
      creditBalance: 100.5,
    },
    {
      id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5b',
      fullName: 'Bob Smith',
      phoneNumber: '222-333-4444',
      email: 'bob.smith@example.com',
      status: 0,
      avatarUrl: 'http://example.com/avatars/bob.jpg',
      school: schools[1],
      roles: ['ContentModerator', 'Teacher'],
      creditBalance: 75.0,
    },
    {
      id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5c',
      fullName: 'Charlie Brown',
      phoneNumber: '333-444-5555',
      email: 'charlie.brown@example.com',
      status: 1,
      avatarUrl: 'http://example.com/avatars/charlie.jpg',
      school: schools[2],
      roles: ['Student'],
      creditBalance: 50.0,
    },
  ];

  const mockUserDetail: User = {
    id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5a',
    fullName: 'Alice Johnson',
    phoneNumber: '111-222-3333',
    email: 'alice.johnson@example.com',
    status: 0,
    avatarUrl: 'http://example.com/avatars/alice.jpg',
    school: schools[0],
    roles: ['SystemAdmin', 'SchoolAdmin'],
    creditBalance: 100.5,
  };

  const mockCurrentUser: User = {
    id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5c',
    fullName: 'Charlie Brown',
    phoneNumber: '333-444-5555',
    email: 'charlie.brown@example.com',
    status: 1,
    avatarUrl: 'http://example.com/avatars/charlie.jpg',
    school: schools[2],
    roles: ['Student'],
    creditBalance: 50.0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService, RequestService, ToastHandlingService],
    });

    service = TestBed.inject(UserService);
    requestService = TestBed.inject(RequestService);
    toastService = TestBed.inject(ToastHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentProfile', () => {
    it('should fetch current user profile and update signal on success', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockCurrentUser,
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

      service.getCurrentProfile().subscribe(response => {
        expect(response).toEqual(mockCurrentUser);
        expect(service.currentUser()).toEqual(mockCurrentUser);
      });
    });

    it('should show error message on failure', () => {
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(toastService, 'errorGeneral');

      service.getCurrentProfile().subscribe(response => {
        expect(response).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const error = new Error('Test error');

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(toastService, 'errorGeneral');

      service.getCurrentProfile().subscribe({
        next: () => fail('Should have failed'),
        error: () => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('getUsers', () => {
    it('should fetch users and update signals on success', () => {
      const params: UserListParams = { pageIndex: 1, pageSize: 10, role: 1 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockUsers,
          count: mockUsers.length,
        },
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

      service.getUsers(params).subscribe(response => {
        expect(response).toEqual(mockResponse.data);
        expect(service.users()).toEqual(mockUsers);
        expect(service.totalUsers()).toEqual(mockUsers.length);
      });
    });

    it('should reset users and show error on non-success status', () => {
      const params: UserListParams = { pageIndex: 1, pageSize: 10, role: 1 };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(service as any, 'resetUsers').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getUsers(params).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetUsers).toHaveBeenCalled();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const params: UserListParams = { pageIndex: 1, pageSize: 10, role: 1 };
      const error = new Error('Test error');

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(service as any, 'resetUsers').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getUsers(params).subscribe({
        next: () => fail('Should have failed'),
        error: () => {
          expect((service as any).resetUsers).toHaveBeenCalled();
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('getUserDetailById', () => {
    it('should fetch user detail and update signal on success', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockUserDetail,
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));

      service.getUserDetailById(id).subscribe(response => {
        expect(response).toEqual(mockUserDetail);
        expect(service.userDetail()).toEqual(mockUserDetail);
      });
    });

    it('should reset user detail and show error on non-success status', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      spyOn(requestService, 'get').and.returnValue(of(mockResponse));
      spyOn(service as any, 'resetUser').and.callThrough();
      spyOn(toastService, 'errorGeneral');

      service.getUserDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect((service as any).resetUser).toHaveBeenCalled();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'get').and.returnValue(throwError(error));
      spyOn(toastService, 'errorGeneral');

      service.getUserDetailById(id).subscribe({
        next: () => fail('Should have failed'),
        error: () => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('activateUser', () => {
    it('should show success message on successful activation', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

      service.activateUser(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Kích hoạt người dùng thành công!'
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

      service.activateUser(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));
      spyOn(toastService, 'errorGeneral');

      service.activateUser(id).subscribe({
        next: () => fail('Should have failed'),
        error: () => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('archiveUser', () => {
    it('should show success message on successful archiving', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      spyOn(requestService, 'put').and.returnValue(of(mockResponse));
      spyOn(toastService, 'success');

      service.archiveUser(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Vô hiệu người dùng thành công!'
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

      service.archiveUser(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');

      spyOn(requestService, 'put').and.returnValue(throwError(error));
      spyOn(toastService, 'errorGeneral');

      service.archiveUser(id).subscribe({
        next: () => fail('Should have failed'),
        error: () => {
          expect(toastService.errorGeneral).toHaveBeenCalled();
        },
      });
    });
  });

  describe('reset methods', () => {
    it('should reset users signal', () => {
      (service as any).usersSignal.set(mockUsers);
      (service as any).totalUsersSignal.set(mockUsers.length);

      (service as any).resetUsers();

      expect(service.users()).toEqual([]);
      expect(service.totalUsers()).toEqual(0);
    });

    it('should reset user detail signal', () => {
      (service as any).userDetailSignal.set(mockUserDetail);

      (service as any).resetUser();

      expect(service.userDetail()).toBeNull();
    });
  });
});
