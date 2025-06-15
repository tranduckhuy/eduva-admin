import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PricingPlanCardComponent } from '../pricing-plan-card/pricing-plan-card.component';

@Component({
  selector: 'app-pricing-plan-create',
  standalone: true,
  imports: [
    FormControlComponent,
    FormsModule,
    ButtonComponent,
    PricingPlanCardComponent,
  ],
  templateUrl: './pricing-plan-create.component.html',
  styleUrl: './pricing-plan-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlanCreateComponent {
  name = signal<string>('');
  description = signal<string>('');
  creditLimit = signal<number>(0);
  storageLimit = signal<number>(0);
  maxAccounts = signal<number>(0);
  price = signal<number>(0);
  billingCycle = signal<string>('monthly');

  billingCycleOptions = [
    { label: 'Tháng', value: 'monthly' },
    { label: 'Năm', value: 'yearly' },
  ];

  submitted = false;

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
    }
    // Submit logic
  }
}
