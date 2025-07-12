import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, catchError, of, EMPTY } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { EntityListResponse } from '../../../shared/models/api/response/query/entity-list-response.model';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { SubscriptionPlan } from '../model/subscription-plan.model';
import { SubscriptionPlanRequest } from '../model/subscription-plan-request.model';
import { BaseResponse } from '../../../shared/models/api/base-response.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService {
  private readonly requestService = inject(RequestService);
  private readonly toastService = inject(ToastHandlingService);
  private readonly router = inject(Router);

  // API URLs
  private readonly BASE_URL = `${environment.baseApiUrl}/subscription-plans`;

  // Signals
  private readonly subscriptionPlansSignal = signal<SubscriptionPlan[]>([]);
  private readonly totalSubscriptionPlansSignal = signal<number>(0);
  private readonly subscriptionPlanDetailSignal =
    signal<SubscriptionPlan | null>(null);

  // Readonly signals
  readonly subscriptionPlans = this.subscriptionPlansSignal.asReadonly();
  readonly totalSubscriptionPlans =
    this.totalSubscriptionPlansSignal.asReadonly();
  readonly subscriptionPlanDetail =
    this.subscriptionPlanDetailSignal.asReadonly();

  /**
   * Fetches a list of subscription plans
   * @param params List parameters
   * @returns Observable with EntityListResponse or null
   */
  getSubscriptionPlans(
    params: EntityListParams
  ): Observable<EntityListResponse<SubscriptionPlan> | null> {
    return this.handleRequest<EntityListResponse<SubscriptionPlan>>(
      this.requestService.get<EntityListResponse<SubscriptionPlan>>(
        this.BASE_URL,
        params,
        {
          loadingKey: 'get-subscription-plans',
        }
      ),
      {
        successHandler: data => {
          this.subscriptionPlansSignal.set(data.data);
          this.totalSubscriptionPlansSignal.set(data.count);
        },
        errorHandler: () => this.resetSubscriptionPlans(),
      }
    );
  }

  /**
   * Fetches subscription plan details by ID
   * @param id Plan ID
   * @returns Observable with SubscriptionPlan or null
   */
  getSubscriptionPlanDetailById(
    id: string
  ): Observable<SubscriptionPlan | null> {
    return this.handleRequest<SubscriptionPlan>(
      this.requestService.get<SubscriptionPlan>(`${this.BASE_URL}/${id}`),
      {
        successHandler: data => this.subscriptionPlanDetailSignal.set(data),
        errorHandler: () => this.resetSubscriptionPlanDetail(),
      }
    );
  }

  /**
   * Creates a new subscription plan
   * @param req Plan request data
   * @returns Observable<void>
   */
  createSubscriptionPlan(req: SubscriptionPlanRequest): Observable<void> {
    return this.handleCreationRequest(
      this.requestService.post<void>(this.BASE_URL, req),
      'Gói đăng ký đã được tạo mới thành công!',
      'admin/subscription-plans'
    );
  }

  /**
   * Updates an existing subscription plan
   * @param req Plan request data
   * @param id Plan ID to update
   * @returns Observable<void>
   */
  updateSubscriptionPlan(
    req: SubscriptionPlanRequest,
    id: string
  ): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}`, req),
      'Gói đăng ký cập nhật thông tin thành công!',
      true
    );
  }

  /**
   * Activates a subscription plan
   * @param id Plan ID to activate
   * @returns Observable<void>
   */
  activateSubscriptionPlan(id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}/activate`, '', {
        loadingKey: 'activate-subscription-plan',
      }),
      'Kích hoạt gói đăng ký thành công!'
    );
  }

  /**
   * Archives a subscription plan
   * @param id Plan ID to archive
   * @returns Observable<void>
   */
  archiveSubscriptionPlan(id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}/archive`, '', {
        loadingKey: 'archive-subscription-plan',
      }),
      'Vô hiệu hóa gói đăng ký thành công!'
    );
  }

  // Private helper methods

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

  private handleModificationRequest(
    request$: Observable<BaseResponse<void>>,
    successMessage: string,
    handleNameConflict: boolean = false
  ): Observable<void> {
    return request$.pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS) {
          this.toastService.success('Thành công', successMessage);
        } else {
          this.toastService.errorGeneral();
        }
      }),
      catchError((err: HttpErrorResponse) => {
        switch (err.error?.statusCode) {
          case StatusCode.PROVIDED_INFORMATION_IS_INVALID:
            if (handleNameConflict) {
              this.toastService.warn(
                'Không thể cập nhật gói',
                'Tên gói đăng ký đã tồn tại. Vui lòng chọn tên khác!'
              );
            }
            break;
          case StatusCode.PLAN_IN_USE:
            this.toastService.warn(
              'Không thể cập nhật gói',
              'Gói đăng ký này đang được sử dụng bởi một hoặc nhiều trường và không thể vô hiệu hóa.'
            );
            break;
          default:
            this.toastService.errorGeneral();
        }

        return of(void 0);
      })
    );
  }

  private handleCreationRequest(
    request$: Observable<BaseResponse<void>>,
    successMessage: string,
    redirectUrl: string
  ): Observable<void> {
    return request$.pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS) {
          this.router.navigateByUrl(redirectUrl);
          this.toastService.success('Thành công', successMessage);
        } else {
          this.toastService.errorGeneral();
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (
          err.error.statusCode === StatusCode.PROVIDED_INFORMATION_IS_INVALID
        ) {
          this.toastService.error(
            'Thông tin cung cấp không hợp lệ',
            'Tên gói đăng ký đã tồn tại. Vui lòng chọn tên khác!'
          );
        } else {
          this.toastService.errorGeneral();
        }
        return of(void 0);
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
