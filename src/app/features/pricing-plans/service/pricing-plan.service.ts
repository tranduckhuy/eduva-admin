import { inject, Injectable, signal } from '@angular/core';

import { finalize, map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { PricingPlan } from '../model/pricing-plan.model';
import { EntityListResponse } from '../../../shared/models/api/response/entity-list-respone.model';
import { PricingPlanParams } from '../model/pricing-plan-params.model';
@Injectable({
  providedIn: 'root',
})
export class PricingPlanService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly GET_PRICING_PLANS_API_URL = `${this.BASE_API_URL}/subscription-plans`;

  private readonly isLoadingSignal = signal<boolean>(false);
  isLoading = this.isLoadingSignal.asReadonly();

  private readonly pricingPlansSignal = signal<PricingPlan[]>([]);
  pricingPlans = this.pricingPlansSignal.asReadonly();

  private readonly totalPricingPlansSignal = signal<number>(0);
  totalPricingPlans = this.totalPricingPlansSignal.asReadonly();

  getPricingPlans(
    params: PricingPlanParams
  ): Observable<EntityListResponse<PricingPlan> | null> {
    this.isLoadingSignal.set(true);
    return this.requestService
      .get<EntityListResponse<PricingPlan> | null>(
        this.GET_PRICING_PLANS_API_URL,
        params
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
        finalize(() => {
          this.isLoadingSignal.set(false);
        })
      );
  }

  private resetPricingPlans(): void {
    this.pricingPlansSignal.set([]);
    this.totalPricingPlansSignal.set(0);
  }
}
