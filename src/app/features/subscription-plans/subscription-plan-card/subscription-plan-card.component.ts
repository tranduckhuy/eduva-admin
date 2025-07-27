import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToggleSwitch } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-subscription-plan-card',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    ToggleSwitch,
    ButtonModule,
  ],
  templateUrl: './subscription-plan-card.component.html',
  styleUrl: './subscription-plan-card.component.css',
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
