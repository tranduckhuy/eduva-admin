import { Injectable, inject, signal } from '@angular/core';
import { EMPTY, Observable, catchError, map } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';
import { type User } from '../../../models/entities/user.model';
import { EntityListResponse } from '../../../models/api/response/entity-list-response.model';
import { UserListParams } from '../../../models/common/user-list-params';
import { BaseResponse } from '../../../models/api/response/base-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly requestService = inject(RequestService);
  private readonly toastService = inject(ToastHandlingService);

  // Signals
  private readonly usersSignal = signal<User[]>([]);
  private readonly totalUsersSignal = signal<number>(0);
  private readonly userDetailSignal = signal<User | null>(null);
  private readonly currentUserSignal = signal<User | null>(null);

  // Readonly signals
  readonly users = this.usersSignal.asReadonly();
  readonly totalUsers = this.totalUsersSignal.asReadonly();
  readonly userDetail = this.userDetailSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  // API URLs
  private readonly BASE_URL = `${environment.baseApiUrl}/users`;
  private readonly PROFILE_URL = `${this.BASE_URL}/profile`;

  /**
   * Fetches the current user's profile
   * @returns Observable with User data or null
   */
  getCurrentProfile(): Observable<User | null> {
    return this.handleRequest<User>(
      this.requestService.get<User>(this.PROFILE_URL),
      {
        successHandler: data => this.currentUserSignal.set(data),
      }
    );
  }

  /**
   * Fetches a list of users with pagination/sorting/filtering
   * @param params User list parameters
   * @returns Observable with EntityListResponse or null
   */
  getUsers(
    params: UserListParams
  ): Observable<EntityListResponse<User> | null> {
    return this.handleRequest<EntityListResponse<User>>(
      this.requestService.get<EntityListResponse<User>>(this.BASE_URL, params, {
        loadingKey: 'get-users',
      }),
      {
        successHandler: data => {
          this.usersSignal.set(data.data);
          this.totalUsersSignal.set(data.count);
        },
        errorHandler: () => this.resetUsers(),
      }
    );
  }

  /**
   * Fetches user details by ID
   * @param id User ID
   * @returns Observable with User data or null
   */
  getUserDetailById(id: string): Observable<User | null> {
    return this.handleRequest<User>(
      this.requestService.get<User>(`${this.BASE_URL}/${id}`),
      {
        successHandler: data => this.userDetailSignal.set(data),
        errorHandler: () => this.resetUser(),
      }
    );
  }

  /**
   * Activates a user account
   * @param id User ID to activate
   * @returns Observable<void>
   */
  activateUser(id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}/unlock`, '', {
        loadingKey: 'activate-user',
      }),
      'Kích hoạt người dùng thành công!'
    );
  }

  /**
   * Archives a user account
   * @param id User ID to archive
   * @returns Observable<void>
   */
  archiveUser(id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}/lock`, '', {
        loadingKey: 'archive-user',
      }),
      'Vô hiệu người dùng thành công!'
    );
  }

  // Private helper methods

  /**
   * Handles common request patterns with success/error handling
   */
  private handleRequest<T>(
    request$: Observable<BaseResponse<T>>,
    options: {
      successHandler?: (data: T) => void;
      errorHandler?: () => void;
    } = {}
  ): Observable<T | null> {
    return request$.pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS && res.data !== undefined) {
          options.successHandler?.(res.data);
          return res.data;
        }
        options.errorHandler?.();
        this.toastService.errorGeneral();
        return null;
      }),
      catchError(() => {
        this.toastService.errorGeneral();
        return EMPTY;
      })
    );
  }

  /**
   * Handles modification requests (activate/archive) with common patterns
   */
  private handleModificationRequest(
    request$: Observable<BaseResponse<void>>,
    successMessage: string
  ): Observable<void> {
    return request$.pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS) {
          this.toastService.success('Thành công', successMessage);
        } else {
          this.toastService.errorGeneral();
        }
      }),
      catchError(() => {
        this.toastService.errorGeneral();
        return EMPTY;
      })
    );
  }

  private resetUsers(): void {
    this.usersSignal.set([]);
    this.totalUsersSignal.set(0);
  }

  private resetUser(): void {
    this.userDetailSignal.set(null);
  }
}
