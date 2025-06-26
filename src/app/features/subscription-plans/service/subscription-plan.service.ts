import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, Observable, catchError, of, EMPTY } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { EntityListResponse } from '../../../shared/models/api/response/entity-list-response.model';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { SubscriptionPlan } from '../model/subscription-plan.model';
import { SubscriptionPlanRequest } from '../model/subscription-plan-request.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlanService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);
  private readonly router = inject(Router);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly SUBSCRIPTION_PLANS_API_URL = `${this.BASE_API_URL}/subscription-plans`;

  private readonly subscriptionPlansSignal = signal<SubscriptionPlan[]>([]);
  subscriptionPlans = this.subscriptionPlansSignal.asReadonly();

  private readonly totalSubscriptionPlansSignal = signal<number>(0);
  totalSubscriptionPlans = this.totalSubscriptionPlansSignal.asReadonly();

  private readonly subscriptionPlanDetailSignal =
    signal<SubscriptionPlan | null>(null);
  subscriptionPlanDetail = this.subscriptionPlanDetailSignal.asReadonly();

  getSubscriptionPlans(
    params: EntityListParams
  ): Observable<EntityListResponse<SubscriptionPlan> | null> {
    return this.requestService
      .get<EntityListResponse<SubscriptionPlan> | null>(
        this.SUBSCRIPTION_PLANS_API_URL,
        params,
        {
          loadingKey: 'get-subscription-plans',
        }
      )
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            const { data, count } = res.data;
            this.subscriptionPlansSignal.set(data);
            this.totalSubscriptionPlansSignal.set(count);
            return res.data;
          } else {
            this.resetSubscriptionPlans();
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

  getSubscriptionPlanDetailById(
    id: string
  ): Observable<SubscriptionPlan | null> {
    return this.requestService
      .get<SubscriptionPlan | null>(`${this.SUBSCRIPTION_PLANS_API_URL}/${id}`)
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            this.subscriptionPlanDetailSignal.set(res.data);
            return res.data;
          } else {
            this.resetSubscriptionPlanDetail();
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

  createSubscriptionPlan(req: SubscriptionPlanRequest): Observable<void> {
    return this.requestService
      .post<void>(this.SUBSCRIPTION_PLANS_API_URL, req)
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.router.navigateByUrl('subscription-plans');
            this.toastHandlingService.success(
              'Thành công',
              'Gói đăng ký đã được tạo mới thành công!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
        }),
        catchError((err: HttpErrorResponse) => {
          if (
            err.error.statusCode &&
            StatusCode.PROVIDED_INFORMATION_IS_INVALID
          ) {
            this.toastHandlingService.error(
              'Thông tin cung cấp không hợp lệ',
              'Tên gói đăng ký đã tồn tại. Vui lòng chọn tên khác!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
          return of(void 0);
        })
      );
  }

  updateSubscriptionPlan(
    req: SubscriptionPlanRequest,
    id: string
  ): Observable<void> {
    return this.requestService
      .put<void>(`${this.SUBSCRIPTION_PLANS_API_URL}/${id}`, req)
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Gói đăng ký cập nhật thông tin thành công!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
        }),
        catchError((err: HttpErrorResponse) => {
          if (
            err.error.statusCode &&
            StatusCode.PROVIDED_INFORMATION_IS_INVALID
          ) {
            this.toastHandlingService.error(
              'Thông tin cung cấp không hợp lệ',
              'Tên gói đăng ký đã tồn tại. Vui lòng chọn tên khác!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
          return of(void 0);
        })
      );
  }

  activateSubscriptionPlan(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.SUBSCRIPTION_PLANS_API_URL}/${id}/activate`, '', {
        loadingKey: 'activate-subscription-plan',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Kích hoạt gói đăng ký thành công!'
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

  archiveSubscriptionPlan(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.SUBSCRIPTION_PLANS_API_URL}/${id}/archive`, '', {
        loadingKey: 'archive-subscription-plan',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Vô hiệu hóa gói đăng ký thành công!'
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

  private resetSubscriptionPlans(): void {
    this.subscriptionPlansSignal.set([]);
    this.totalSubscriptionPlansSignal.set(0);
  }

  private resetSubscriptionPlanDetail(): void {
    this.subscriptionPlanDetailSignal.set(null);
  }
}
