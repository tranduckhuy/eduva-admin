import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SubscriptionPlanCardComponent } from '../subscription-plan-card/subscription-plan-card.component';
import { SubscriptionPlanService } from '../service/subscription-plan.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { SubscriptionPlanRequest } from '../model/subscription-plan-request.model';

@Component({
  selector: 'app-subscription-plan-create',
  standalone: true,
  imports: [
    FormControlComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SubscriptionPlanCardComponent,
  ],
  templateUrl: './subscription-plan-create.component.html',
  styleUrl: './subscription-plan-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPlanCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly SubscriptionPlanService = inject(SubscriptionPlanService);
  private readonly loadingService = inject(LoadingService);

  isLoading = this.loadingService.isLoading;

  form!: FormGroup;

  submitted = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      maxUsers: [0, [Validators.required, Validators.min(1)]],
      storageLimitGB: [0, [Validators.required, Validators.min(1)]],
      priceMonthly: [0, [Validators.required, Validators.min(1)]],
      pricePerYear: [0, [Validators.required, Validators.min(1)]],
      isRecommended: [false],
    });
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const req: SubscriptionPlanRequest = {
      name: this.form.value.name,
      description: this.form.value.description,
      maxUsers: this.form.value.maxUsers,
      storageLimitGB: this.form.value.storageLimitGB,
      priceMonthly: this.form.value.priceMonthly,
      pricePerYear: this.form.value.pricePerYear,
      isRecommended: this.form.value.isRecommended,
    };

    this.SubscriptionPlanService.createSubscriptionPlan(req).subscribe();
  }
}
