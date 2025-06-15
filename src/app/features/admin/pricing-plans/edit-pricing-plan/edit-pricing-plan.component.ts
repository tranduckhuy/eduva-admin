import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  OnInit,
  signal,
} from '@angular/core';
import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PricingPlanCardComponent } from '../pricing-plan-card/pricing-plan-card.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';

registerLocaleData(localeVi);

@Component({
  selector: 'app-edit-pricing-plan',
  standalone: true,
  imports: [
    FormControlComponent,
    FormsModule,
    ButtonComponent,
    PricingPlanCardComponent,
  ],
  templateUrl: './edit-pricing-plan.component.html',

  styleUrl: './edit-pricing-plan.component.css',
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'vi-VN' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPricingPlanComponent implements OnInit {
  pricingPlan = {
    id: 1,
    name: 'Basic Monthly',
    description: 'Gói cơ bản, phù hợp với trường nhỏ (thanh toán theo tháng)',
    creditLimit: 500,
    storageLimit: 50,
    maxAccounts: 10,
    price: 1000000,
    billingCycle: 'monthly',
    status: 'active',
    createdAt: new Date('2021-09-01'),
    lastModifiedAt: new Date('2023-05-01'),
  };

  pricingPlanId = signal<string>('');

  name = signal<string>('');
  description = signal<string>('');
  creditLimit = signal<number>(0);
  storageLimit = signal<number>(0);
  maxAccounts = signal<number>(0);
  price = signal<number>(0);
  status = signal<string>('active');
  createdAt = signal<string>('');
  lastModifiedAt = signal<string>('');
  billingCycle = signal<string>('monthly');

  billingCycleOptions = [
    { label: 'Tháng', value: 'monthly' },
    { label: 'Năm', value: 'yearly' },
  ];

  submitted = false;

  constructor(private readonly datePipe: DatePipe) {}

  ngOnInit(): void {
    this.name.set(this.pricingPlan.name);
    this.description.set(this.pricingPlan.description);
    this.creditLimit.set(this.pricingPlan.creditLimit);
    this.storageLimit.set(this.pricingPlan.storageLimit);
    this.maxAccounts.set(this.pricingPlan.maxAccounts);
    this.price.set(this.pricingPlan.price);
    this.billingCycle.set(this.pricingPlan.billingCycle);
    this.status.set(this.pricingPlan.status);
    this.createdAt.set(this.formatDateVi(new Date(this.pricingPlan.createdAt)));
    this.lastModifiedAt.set(
      this.formatDateVi(new Date(this.pricingPlan.lastModifiedAt))
    );
  }

  formatDateVi(date: Date | string): string {
    return this.datePipe.transform(date, 'medium', undefined, 'vi') ?? '';
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
    }
    // Submit logic
  }
}
