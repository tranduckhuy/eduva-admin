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
import { PricingPlanCardComponent } from '../pricing-plan-card/pricing-plan-card.component';
import { PricingPlanService } from '../service/pricing-plan.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { PricingPlanRequest } from '../model/pricing-plan-request.model';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';

@Component({
  selector: 'app-edit-pricing-plan',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonComponent,
    PricingPlanCardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-pricing-plan.component.html',
  styleUrl: './edit-pricing-plan.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPricingPlanComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pricingPlanService = inject(PricingPlanService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  isLoading = this.loadingService.isLoading;
  pricingPlanDetail = this.pricingPlanService.pricingPlanDetail;
  originalData: PricingPlanRequest | null = null; // Store original data

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      maxUsers: [0, [Validators.required, Validators.min(1)]],
      storageLimitGB: [0, [Validators.required, Validators.min(0)]],
      priceMonthly: [0, [Validators.required, Validators.min(0)]],
      pricePerYear: [0, [Validators.required, Validators.min(0)]],
    });
  }

  form!: FormGroup;

  pricingPlanId = input.required<string>();

  submitted = signal<boolean>(false);

  ngOnInit(): void {
    this.pricingPlanService
      .getPricingPlanDetailById(this.pricingPlanId())
      .subscribe(detail => {
        if (detail) {
          this.originalData = {
            name: detail.name,
            description: detail.description || '',
            maxUsers: detail.maxUsers,
            storageLimitGB: detail.storageLimitGB,
            priceMonthly: detail.priceMonthly,
            pricePerYear: detail.pricePerYear,
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
        this.originalData![key as keyof PricingPlanRequest] !==
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

    const req: PricingPlanRequest = {
      name: this.form.value.name,
      description: this.form.value.description,
      maxUsers: this.form.value.maxUsers,
      storageLimitGB: this.form.value.storageLimitGB,
      priceMonthly: this.form.value.priceMonthly,
      pricePerYear: this.form.value.pricePerYear,
    };

    this.pricingPlanService
      .updatePricingPlan(req, this.pricingPlanId())
      .subscribe();
  }
}
