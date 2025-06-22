import {
  ChangeDetectionStrategy,
  Component,
  input,
  LOCALE_ID,
  signal,
} from '@angular/core';
import localeVi from '@angular/common/locales/vi';
import { CurrencyPipe, registerLocaleData } from '@angular/common';

import { ButtonComponent } from '../../../shared/components/button/button.component';

registerLocaleData(localeVi);

@Component({
  selector: 'app-pricing-plan-card',
  standalone: true,
  imports: [ButtonComponent, CurrencyPipe],
  templateUrl: './pricing-plan-card.component.html',
  styleUrl: './pricing-plan-card.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'vi-VN' }],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlanCardComponent {
  name = input<string>('');
  description = input<string>('');
  creditLimit = input<number>(0);
  storageLimit = input<number>(0);
  maxAccounts = input<number>(0);
  price = input<number>(0);
  billingCycle = input<string>('');
  pricingPlanOptions = signal<string[]>([
    'Dashboard nâng cao',
    'Tạo bài giảng âm thanh',
    'Tạo video bài giảng',
    'Báo cáo chi tiết',
    'Hỗ trợ kỹ thuật 24/7',
  ]);
}
