import { DatePipe, registerLocaleData } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  LOCALE_ID,
  OnInit,
  signal,
} from '@angular/core';
import localeVi from '@angular/common/locales/vi';
import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PricingPlanCardComponent } from '../pricing-plan-card/pricing-plan-card.component';

registerLocaleData(localeVi);

@Component({
  selector: 'app-pricing-plan',
  standalone: true,
  imports: [
    FormControlComponent,
    FormsModule,
    ButtonComponent,
    PricingPlanCardComponent,
  ],
  templateUrl: './pricing-plan.component.html',
  styleUrl: './pricing-plan.component.css',
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'vi-VN' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlanComponent implements OnInit {
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

  pricingPlanId = input.required<string>();

  name = signal<string>('');
  description = signal<string>('');
  creditLimit = signal<number>(0);
  storageLimit = signal<number>(0);
  maxAccounts = signal<number>(0);
  price = signal<number>(0);
  billingCycle = signal<string>('');
  status = signal<string>('active');
  createdAt = signal<string>('');
  lastModifiedAt = signal<string>('');

  constructor(private readonly datePipe: DatePipe) {}

  formatDateVi(date: Date | string): string {
    return this.datePipe.transform(date, 'medium', undefined, 'vi') ?? '';
  }

  ngOnInit(): void {
    this.name.set(this.pricingPlan.name);
    this.description.set(this.pricingPlan.description);
    this.creditLimit.set(this.pricingPlan.creditLimit);
    this.storageLimit.set(this.pricingPlan.storageLimit);
    this.maxAccounts.set(this.pricingPlan.maxAccounts);
    this.price.set(this.pricingPlan.price);
    this.billingCycle.set(
      this.pricingPlan.billingCycle === 'monthly' ? 'Tháng' : 'Năm'
    );
    this.status.set(
      this.pricingPlan.status === 'active' ? 'Đang hoạt động' : 'Vô hiệu hóa'
    );
    this.createdAt.set(this.formatDateVi(new Date(this.pricingPlan.createdAt)));
    this.lastModifiedAt.set(
      this.formatDateVi(new Date(this.pricingPlan.lastModifiedAt))
    );
  }
}
