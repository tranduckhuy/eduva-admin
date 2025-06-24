import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PricingPlanCardComponent } from '../pricing-plan-card/pricing-plan-card.component';
import { PricingPlanService } from '../service/pricing-plan.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { PricingPlanRequest } from '../model/pricing-plan-request.model';

@Component({
  selector: 'app-pricing-plan-create',
  standalone: true,
  imports: [
    FormControlComponent,
    ReactiveFormsModule,
    ButtonComponent,
    PricingPlanCardComponent,
  ],
  templateUrl: './pricing-plan-create.component.html',
  styleUrl: './pricing-plan-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlanCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pricingPlanService = inject(PricingPlanService);
  private readonly loadingService = inject(LoadingService);

  isLoading = this.loadingService;

  form!: FormGroup;

  submitted = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      maxUsers: [0],
      storageLimitGB: [0],
      priceMonthly: [0],
      pricePerYear: [0],
    });
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const req: PricingPlanRequest = {
      name: this.form.value.name,
      description: this.form.value.description,
      maxUsers: this.form.value.maxUsers,
      storageLimitGB: this.form.value.storageLimitGB,
      priceMonthly: this.form.value.priceMonthly,
      pricePerYear: this.form.value.pricePerYear,
    };

    this.pricingPlanService.createPricingPlan(req).subscribe();
  }
}
