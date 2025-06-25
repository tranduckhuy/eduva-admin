import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { map, Observable, catchError, of, EMPTY } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { PricingPlan } from '../model/pricing-plan.model';
import { EntityListResponse } from '../../../shared/models/api/response/entity-list-response.model';
import { PricingPlanRequest } from '../model/pricing-plan-request.model';
import { HttpErrorResponse } from '@angular/common/http';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
@Injectable({
  providedIn: 'root',
})
export class PricingPlanService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);
  private readonly router = inject(Router);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly PRICING_PLANS_API_URL = `${this.BASE_API_URL}/subscription-plans`;

  private readonly pricingPlansSignal = signal<PricingPlan[]>([]);
  pricingPlans = this.pricingPlansSignal.asReadonly();

  private readonly totalPricingPlansSignal = signal<number>(0);
  totalPricingPlans = this.totalPricingPlansSignal.asReadonly();

  private readonly pricingPlanDetailSignal = signal<PricingPlan | null>(null);
  pricingPlanDetail = this.pricingPlanDetailSignal.asReadonly();

  getPricingPlans(
    params: EntityListParams
  ): Observable<EntityListResponse<PricingPlan> | null> {
    return this.requestService
      .get<EntityListResponse<PricingPlan> | null>(
        this.PRICING_PLANS_API_URL,
        params,
        {
          loadingKey: 'get-pricing-plans',
        }
      )
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            const { data, count } = res.data;
            this.pricingPlansSignal.set(data);
            this.totalPricingPlansSignal.set(count);
            return res.data;
          } else {
            this.resetPricingPlans();
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

  getPricingPlanDetailById(id: string): Observable<PricingPlan | null> {
    return this.requestService
      .get<PricingPlan | null>(`${this.PRICING_PLANS_API_URL}/${id}`)
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            this.pricingPlanDetailSignal.set(res.data);
            return res.data;
          } else {
            this.resetPricingPlanDetail();
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

  createPricingPlan(req: PricingPlanRequest): Observable<void> {
    return this.requestService.post<void>(this.PRICING_PLANS_API_URL, req).pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS) {
          this.router.navigateByUrl('pricing-plans');
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

  updatePricingPlan(req: PricingPlanRequest, id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.PRICING_PLANS_API_URL}/${id}`, req)
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

  activatePricingPlan(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.PRICING_PLANS_API_URL}/${id}/activate`, '', {
        loadingKey: 'activate-pricing-plan',
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

  archivePricingPlan(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.PRICING_PLANS_API_URL}/${id}/archive`, '', {
        loadingKey: 'archive-pricing-plan',
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

  private resetPricingPlans(): void {
    this.pricingPlansSignal.set([]);
    this.totalPricingPlansSignal.set(0);
  }

  private resetPricingPlanDetail(): void {
    this.pricingPlanDetailSignal.set(null);
  }
}
