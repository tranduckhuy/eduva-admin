import { Injectable, inject, signal } from '@angular/core';

import { EMPTY, Observable, catchError, map } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';

import { StatusCode } from '../../../constants/status-code.constant';

import { type User } from '../../../models/entities/user.model';
import { EntityListResponse } from '../../../models/api/response/entity-list-response.model';
import { UserListParams } from '../../../models/common/user-list-params';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly usersSignal = signal<User[]>([]);
  users = this.usersSignal.asReadonly();

  private readonly totalUsersSignal = signal<number>(0);
  totalUsers = this.totalUsersSignal.asReadonly();

  private readonly userDetailSignal = signal<User | null>(null);
  userDetail = this.userDetailSignal.asReadonly();

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly USER_API_URL = `${this.BASE_API_URL}/users`;
  private readonly GET_CURRENT_PROFILE_API_URL = `${this.USER_API_URL}/profile`;

  private readonly currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  getCurrentProfile(): Observable<User | null> {
    return this.requestService.get<User>(this.GET_CURRENT_PROFILE_API_URL).pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS && res.data) {
          this.currentUserSignal.set(res.data);
          return res.data;
        } else {
          this.toastHandlingService.errorGeneral();
          return null;
        }
      })
    );
  }

  getUsers(
    params: UserListParams
  ): Observable<EntityListResponse<User> | null> {
    return this.requestService
      .get<EntityListResponse<User> | null>(this.USER_API_URL, params, {
        loadingKey: 'get-users',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            const { data, count } = res.data;
            this.usersSignal.set(data);
            this.totalUsersSignal.set(count);
            return res.data;
          } else {
            this.resetUsers();
            this.toastHandlingService.errorGeneral();
            return null;
          }
        }),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
          return EMPTY;
        })
      );
  }

  getUserDetailById(id: string): Observable<User | null> {
    return this.requestService
      .get<User | null>(`${this.USER_API_URL}/${id}`)
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            this.userDetailSignal.set(res.data);
            return res.data;
          } else {
            this.resetUser();
            this.toastHandlingService.errorGeneral();
            return null;
          }
        }),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
          return EMPTY;
        })
      );
  }

  activateUser(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.USER_API_URL}/${id}/unlock`, '', {
        loadingKey: 'activate-user',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Kích hoạt người dùng thành công!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
        }),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
          return EMPTY;
        })
      );
  }

  archiveUser(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.USER_API_URL}/${id}/lock`, '', {
        loadingKey: 'archive-user',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Vô hiệu người dùng thành công!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
        }),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
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
