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
import { SubscriptionPlanCardComponent } from '../subscription-plan-card/subscription-plan-card.component';
import { SubscriptionPlanService } from '../service/subscription-plan.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';

@Component({
  selector: 'app-subscription-plan',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonComponent,
    SubscriptionPlanCardComponent,
    RouterLink,
  ],
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPlanComponent implements OnInit {
  private readonly subscriptionPlanService = inject(SubscriptionPlanService);
  private readonly loadingService = inject(LoadingService);

  isLoading = this.loadingService;
  subscriptionPlanDetail = this.subscriptionPlanService.subscriptionPlanDetail;

  subscriptionPlanId = input.required<string>();

  ngOnInit(): void {
    this.subscriptionPlanService
      .getSubscriptionPlanDetailById(this.subscriptionPlanId())
      .subscribe();
  }
}
