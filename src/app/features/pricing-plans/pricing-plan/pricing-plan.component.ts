import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PricingPlanCardComponent } from '../pricing-plan-card/pricing-plan-card.component';
import { PricingPlanService } from '../service/pricing-plan.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';

@Component({
  selector: 'app-pricing-plan',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonComponent,
    PricingPlanCardComponent,
    RouterLink,
  ],
  templateUrl: './pricing-plan.component.html',
  styleUrl: './pricing-plan.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlanComponent implements OnInit {
  private readonly pricingPlanService = inject(PricingPlanService);
  private readonly loadingService = inject(LoadingService);

  isLoading = this.loadingService;
  pricingPlanDetail = this.pricingPlanService.pricingPlanDetail;

  pricingPlanId = input.required<string>();

  ngOnInit(): void {
    this.pricingPlanService
      .getPricingPlanDetailById(this.pricingPlanId())
      .subscribe();
  }
}
