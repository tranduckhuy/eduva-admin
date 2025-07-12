import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
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
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { SubscriptionPlanService } from '../service/subscription-plan.service';
import { SubscriptionPlanRequest } from '../model/subscription-plan-request.model';
import { SubscriptionPlanCardComponent } from '../subscription-plan-card/subscription-plan-card.component';

@Component({
  selector: 'app-edit-subscription-plan',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonComponent,
    SubscriptionPlanCardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-subscription-plan.component.html',
  styleUrl: './edit-subscription-plan.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSubscriptionPlanComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly subscriptionPlanService = inject(SubscriptionPlanService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  isLoading = this.loadingService.isLoading;
  subscriptionPlanDetail = this.subscriptionPlanService.subscriptionPlanDetail;
  originalData: SubscriptionPlanRequest | null = null; // Store original data

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

  form!: FormGroup;

  subscriptionPlanId = input.required<string>();

  submitted = signal<boolean>(false);

  ngOnInit(): void {
    this.subscriptionPlanService
      .getSubscriptionPlanDetailById(this.subscriptionPlanId())
      .subscribe(detail => {
        if (detail) {
          this.originalData = {
            name: detail.name,
            description: detail.description ?? '',
            maxUsers: detail.maxUsers,
            storageLimitGB: detail.storageLimitGB,
            priceMonthly: detail.priceMonthly,
            pricePerYear: detail.pricePerYear,
            isRecommended: detail.isRecommended,
          };

          this.form.patchValue(this.originalData);
        }
      });
  }

  hasDataChanged(): boolean {
    if (!this.originalData) return true;

    const currentValues = this.form.value;
    return Object.keys(this.originalData).some(
      key =>
        this.originalData![key as keyof SubscriptionPlanRequest] !==
        currentValues[key]
    );
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.hasDataChanged()) {
      this.toastHandlingService.warn(
        'Chú ý',
        'Thông tin cập nhật không có sự thay đổi!'
      );
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

    this.subscriptionPlanService
      .updateSubscriptionPlan(req, this.subscriptionPlanId())
      .subscribe();
  }
}
