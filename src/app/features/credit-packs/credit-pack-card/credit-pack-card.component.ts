import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-credit-pack-card',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, ButtonModule],
  templateUrl: './credit-pack-card.component.html',
  styleUrl: './credit-pack-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPackCardComponent {
  name = input<string>('');
  price = input<number>(0);
  bonusCredits = input<number>(0);
  credits = input<number>(0);
  pricingPlanOptions = signal<string[]>([
    'Sử dụng để tạo nội dung AI',
    'Không giới hạn thời gian sử dụng',
    'Có thể cộng dồn qua các lần mua',
    'Tặng thêm credit khi mua gói lớn',
    'Không cần đăng ký gói tháng',
  ]);
}
