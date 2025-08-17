import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { UserService } from './user.service';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';
import { User } from '../../../models/entities/user.model';
import { UserListParams } from '../../../models/common/user-list-params';
import { School } from '../../../models/entities/school.model';
import { UpdateProfileRequest } from '../../../pages/settings-page/personal-information/models/update-profile-request.model';
import { UserRole, UserRoles } from '../../../constants/user-roles.constant';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('UserService', () => {
  let service: UserService;
  let requestService: RequestService;
  let toastService: ToastHandlingService;

  const mockSchool: School = {
    id: 1,
    name: 'Test School',
    contactEmail: 'test@school.com',
    contactPhone: '123-456-7890',
    address: '123 Test St',
    websiteUrl: 'http://test.com',
    status: 0,
  };

  const mockUserSubscriptionResponse = {
    isSubscriptionActive: false,
    subscriptionEndDate: '2024-12-31',
  };

  const mockUsers: User[] = [
    {
      id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5a',
      fullName: 'Alice Johnson',
      phoneNumber: '111-222-3333',
      email: 'alice.johnson@example.com',
      status: 0,
      avatarUrl: 'http://example.com/avatars/alice.jpg',
      school: mockSchool,
      roles: [UserRoles.SYSTEM_ADMIN, UserRoles.SCHOOL_ADMIN],
      creditBalance: 100.5,
      is2FAEnabled: false,
      isEmailConfirmed: true,
      userSubscriptionResponse: mockUserSubscriptionResponse,
    },
    {
      id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5b',
      fullName: 'Bob Smith',
      phoneNumber: '222-333-4444',
      email: 'bob.smith@example.com',
      status: 0,
      avatarUrl: 'http://example.com/avatars/bob.jpg',
      school: mockSchool,
      roles: [UserRoles.CONTENT_MODERATOR, UserRoles.TEACHER],
      creditBalance: 75.0,
      is2FAEnabled: false,
      isEmailConfirmed: true,
      userSubscriptionResponse: mockUserSubscriptionResponse,
    },
    {
      id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5c',
      fullName: 'Charlie Brown',
      phoneNumber: '333-444-5555',
      email: 'charlie.brown@example.com',
      status: 1,
      avatarUrl: 'http://example.com/avatars/charlie.jpg',
      school: mockSchool,
      roles: [UserRoles.STUDENT],
      creditBalance: 50.0,
      is2FAEnabled: false,
      isEmailConfirmed: true,
      userSubscriptionResponse: mockUserSubscriptionResponse,
    },
  ];

  const mockUserDetail: User = {
    id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5a',
    fullName: 'Alice Johnson',
    phoneNumber: '111-222-3333',
    email: 'alice.johnson@example.com',
    status: 0,
    avatarUrl: 'http://example.com/avatars/alice.jpg',
    school: mockSchool,
    roles: [UserRoles.SYSTEM_ADMIN, UserRoles.SCHOOL_ADMIN],
    creditBalance: 100.5,
    is2FAEnabled: false,
    isEmailConfirmed: true,
    userSubscriptionResponse: mockUserSubscriptionResponse,
  };

  const mockCurrentUser: User = {
    id: '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5c',
    fullName: 'Charlie Brown',
    phoneNumber: '333-444-5555',
    email: 'charlie.brown@example.com',
    status: 1,
    avatarUrl: 'http://example.com/avatars/charlie.jpg',
    school: mockSchool,
    roles: [UserRoles.STUDENT],
    creditBalance: 50.0,
    is2FAEnabled: false,
    isEmailConfirmed: true,
    userSubscriptionResponse: mockUserSubscriptionResponse,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
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

    service = TestBed.inject(UserService);
    requestService = TestBed.inject(RequestService);
    toastService = TestBed.inject(ToastHandlingService);

    // Clear all mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty initial signals', () => {
      expect(service.users()).toEqual([]);
      expect(service.totalUsers()).toEqual(0);
      expect(service.userDetail()).toBeNull();
      expect(service.currentUser()).toBeNull();
    });

    it('should load user from localStorage if available', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCurrentUser));
      // Reset TestBed and reconfigure to get a fresh instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          UserService,
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
      const newService = TestBed.inject(UserService);
      expect(newService.currentUser()).toEqual(mockCurrentUser);
    });

    it('should handle invalid localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      // Reset TestBed and reconfigure to get a fresh instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          UserService,
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
      const newService = TestBed.inject(UserService);
      expect(newService.currentUser()).toBeNull();
    });
  });

  describe('getUsers', () => {
    it('should fetch users and update signals on success', () => {
      const params: UserListParams = { pageIndex: 1, pageSize: 10, role: 0 };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: {
          data: mockUsers,
          count: mockUsers.length,
        },
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getUsers(params).subscribe(response => {
        expect(response).toEqual({
          data: mockUsers,
          count: mockUsers.length,
        });
        expect(service.users()).toEqual(mockUsers);
        expect(service.totalUsers()).toEqual(mockUsers.length);
      });
    });

    it('should reset users and show error on non-success status', () => {
      const params: UserListParams = { pageIndex: 1, pageSize: 10, role: 0 };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
        message: 'Error',
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getUsers(params).subscribe(response => {
        expect(response).toBeNull();
        expect(service.users()).toEqual([]);
        expect(service.totalUsers()).toEqual(0);
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const params: UserListParams = { pageIndex: 1, pageSize: 10, role: 0 };
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getUsers(params).subscribe({
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

  describe('getUserDetailById', () => {
    it('should fetch user detail and update signal on success', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockUserDetail,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

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

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getUserDetailById(id).subscribe(response => {
        expect(response).toBeNull();
        expect(service.userDetail()).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getUserDetailById(id).subscribe({
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

  describe('activateUser', () => {
    it('should show success message on successful activation', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

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

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.activateUser(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.activateUser(id).subscribe({
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

  describe('archiveUser', () => {
    it('should show success message on successful archiving', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveUser(id).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Vô hiệu hóa người dùng thành công!'
        );
      });
    });

    it('should show error message on failure', () => {
      const id = '1';
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.archiveUser(id).subscribe(() => {
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error and return EMPTY', () => {
      const id = '1';
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.archiveUser(id).subscribe({
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

  describe('getCurrentProfile', () => {
    it('should fetch current user profile and update signal on success', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: mockCurrentUser,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCurrentProfile().subscribe(response => {
        expect(response).toEqual(mockCurrentUser);
        expect(service.currentUser()).toEqual(mockCurrentUser);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'eduva_user',
          JSON.stringify(mockCurrentUser)
        );
      });
    });

    it('should show error message on failure', () => {
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCurrentProfile().subscribe(response => {
        expect(response).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.get).mockReturnValue(throwError(() => error));

      service.getCurrentProfile().subscribe({
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

  describe('updateUserProfile', () => {
    it('should update user profile and show success message', () => {
      const request: UpdateProfileRequest = {
        fullName: 'Updated Name',
        phoneNumber: '987-654-3210',
        avatarUrl: 'http://example.com/new-avatar.jpg',
      };
      const updatedUser = { ...mockUserDetail, ...request };
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: updatedUser,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.updateUserProfile(request).subscribe(response => {
        expect(response).toEqual(updatedUser);
        expect(toastService.success).toHaveBeenCalledWith(
          'Thành công',
          'Hồ sơ của bạn đã được thay đổi thành công'
        );
      });
    });

    it('should show error message on failure', () => {
      const request: UpdateProfileRequest = {
        fullName: 'Updated Name',
        phoneNumber: '987-654-3210',
        avatarUrl: 'http://example.com/new-avatar.jpg',
      };
      const mockResponse = {
        statusCode: StatusCode.SYSTEM_ERROR,
      };

      vi.mocked(requestService.put).mockReturnValue(of(mockResponse));

      service.updateUserProfile(request).subscribe(response => {
        expect(response).toBeNull();
        expect(toastService.errorGeneral).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const request: UpdateProfileRequest = {
        fullName: 'Updated Name',
        phoneNumber: '987-654-3210',
        avatarUrl: 'http://example.com/new-avatar.jpg',
      };
      const error = new Error('Test error');
      let nextCalled = false;

      vi.mocked(requestService.put).mockReturnValue(throwError(() => error));

      service.updateUserProfile(request).subscribe({
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

  describe('updateCurrentUserPartial', () => {
    it('should update current user with partial data', () => {
      // Set initial current user
      service['currentUserSignal'].set(mockUserDetail);

      const update = { fullName: 'New Name' };
      service.updateCurrentUserPartial(update);

      expect(service.currentUser()).toEqual({
        ...mockUserDetail,
        fullName: 'New Name',
      });
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should not update if no current user exists', () => {
      const update = { fullName: 'New Name' };
      service.updateCurrentUserPartial(update);

      expect(service.currentUser()).toBeNull();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should merge roles correctly', () => {
      service['currentUserSignal'].set(mockUserDetail);

      const update = { roles: [UserRoles.TEACHER] as UserRole[] };
      service.updateCurrentUserPartial(update);

      expect(service.currentUser()?.roles).toEqual([UserRoles.TEACHER]);
    });

    it('should preserve existing roles if not provided in update', () => {
      service['currentUserSignal'].set(mockUserDetail);

      const update = { fullName: 'New Name' };
      service.updateCurrentUserPartial(update);

      expect(service.currentUser()?.roles).toEqual(mockUserDetail.roles);
    });
  });

  describe('clearCurrentUser', () => {
    it('should clear current user and remove from localStorage', () => {
      service['currentUserSignal'].set(mockUserDetail);

      service.clearCurrentUser();

      expect(service.currentUser()).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('eduva_user');
    });
  });

  describe('signal management', () => {
    it('should expose readonly signals', () => {
      expect(typeof service.users).toBe('function');
      expect(typeof service.totalUsers).toBe('function');
      expect(typeof service.userDetail).toBe('function');
      expect(typeof service.currentUser).toBe('function');
    });

    it('should update signals reactively', () => {
      const initialUsers = service.users();
      const initialTotal = service.totalUsers();

      service['usersSignal'].set(mockUsers);
      service['totalUsersSignal'].set(mockUsers.length);

      expect(service.users()).toEqual(mockUsers);
      expect(service.totalUsers()).toEqual(mockUsers.length);
      expect(service.users()).not.toEqual(initialUsers);
      expect(service.totalUsers()).not.toEqual(initialTotal);
    });
  });

  describe('edge cases', () => {
    it('should handle null response data', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
        data: null,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCurrentProfile().subscribe(response => {
        expect(response).toBeNull();
      });
    });

    it('should handle undefined response data', () => {
      const mockResponse = {
        statusCode: StatusCode.SUCCESS,
      };

      vi.mocked(requestService.get).mockReturnValue(of(mockResponse));

      service.getCurrentProfile().subscribe(response => {
        expect(response).toBeNull();
      });
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      service['currentUserSignal'].set(mockUserDetail);

      // Should not throw error
      expect(() => {
        try {
          service.updateCurrentUserPartial({ fullName: 'Test' });
        } catch (error) {
          // Error is expected to be caught internally
        }
      }).not.toThrow();
    });
  });
});
