import {
  ChangeDetectionStrategy,
  Component,
  input,
  LOCALE_ID,
  signal,
} from '@angular/core';
import localeVi from '@angular/common/locales/vi';
import {
  CommonModule,
  CurrencyPipe,
  registerLocaleData,
} from '@angular/common';

import { ToggleSwitch } from 'primeng/toggleswitch';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';

registerLocaleData(localeVi);

@Component({
  selector: 'app-subscription-plan-card',
  standalone: true,
  imports: [
    ButtonComponent,
    CurrencyPipe,
    ToggleSwitch,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './subscription-plan-card.component.html',
  styleUrl: './subscription-plan-card.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'vi-VN' }],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPlanCardComponent {
  name = input<string>('');
  description = input<string>('');
  storageLimitGB = input<number>(0);
  maxUsers = input<number>(0);
  priceMonthly = input<number>(0);
  pricePerYear = input<number>(0);
  subscriptionPlanOptions = signal<string[]>([
    'Dashboard nâng cao',
    'Tạo bài giảng âm thanh',
    'Tạo video bài giảng',
    'Báo cáo chi tiết',
    'Hỗ trợ kỹ thuật 24/7',
  ]);

  isYearly = signal<boolean>(false);
}
