import { Injectable, inject, signal } from '@angular/core';

import { EMPTY, Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';

import { StatusCode } from '../../../constants/status-code.constant';

import { type User } from '../../../models/entities/user.model';
import { type UpdateProfileRequest } from '../../../pages/settings-page/personal-information/models/update-profile-request.model';
import { type EntityListResponse } from '../../../models/api/response/entity-list-response.model';
import { type UserListParams } from '../../../models/common/user-list-params';

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
  private readonly USER_PROFILE_API_URL = `${this.USER_API_URL}/profile`;

  private readonly SESSION_STORAGE_KEY = 'eduva_user';

  private readonly currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    // Hydrate signal from sessionStorage if sessionStorage have data
    const cachedUser = this.loadUserFromStorage();
    if (cachedUser) {
      this.currentUserSignal.set(cachedUser);
    }
  }

  getCurrentProfile(): Observable<User | null> {
    return this.requestService.get<User>(this.USER_PROFILE_API_URL).pipe(
      tap(res => this.handleGetProfileSideEffect(res)),
      map(res => this.extractUserFromResponse(res)),
      catchError(() => this.handleErrorResponse())
    );
  }

  updateUserProfile(request: UpdateProfileRequest): Observable<User | null> {
    return this.requestService
      .put<User>(this.USER_PROFILE_API_URL, request)
      .pipe(
        tap(res => this.handleUpdateProfileSideEffect(res)),
        map(res => this.extractUserFromResponse(res)),
        catchError(() => this.handleErrorResponse())
      );
  }

  updateCurrentUserPartial(update: Partial<User>): void {
    const current = this.currentUserSignal();
    if (!current) return;
    const merged = { ...current, ...update };
    this.setCurrentUser(merged);
  }

  clearCurrentUser(): void {
    this.setCurrentUser(null);
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

  private handleGetProfileSideEffect(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      this.setCurrentUser(res.data);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private handleUpdateProfileSideEffect(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      this.toastHandlingService.success(
        'Thành công',
        'Hồ sơ của bạn đã được thay đổi thành công'
      );

      const currentUser = this.currentUser();
      const updated = res.data;

      if (!currentUser || !updated) {
        this.toastHandlingService.errorGeneral();
        return;
      }

      const mergedUser = this.mergeUser(currentUser, updated);
      this.setCurrentUser(mergedUser);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractUserFromResponse(res: any): User | null {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      return res.data;
    }
    return null;
  }

  private handleErrorResponse(): Observable<null> {
    this.toastHandlingService.errorGeneral();
    return of(null);
  }

  private mergeUser(current: User, updated: Partial<User>): User {
    return {
      ...current,
      ...updated,
      roles: updated.roles?.length ? updated.roles : current.roles,
      isEmailConfirmed: updated.isEmailConfirmed ?? current.isEmailConfirmed,
      userSubscriptionResponse:
        updated.userSubscriptionResponse ?? current.userSubscriptionResponse,
    };
  }

  private loadUserFromStorage(): User | null {
    const raw = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
    if (user) {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    }
  }
}
