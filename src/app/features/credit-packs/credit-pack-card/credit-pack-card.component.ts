import {
  ChangeDetectionStrategy,
  Component,
  input,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import localeVi from '@angular/common/locales/vi';
import { CurrencyPipe, registerLocaleData } from '@angular/common';

import { ButtonComponent } from '../../../shared/components/button/button.component';

registerLocaleData(localeVi);

@Component({
  selector: 'app-credit-pack-card',
  standalone: true,
  imports: [ButtonComponent, CurrencyPipe, FormsModule],
  templateUrl: './credit-pack-card.component.html',
  styleUrl: './credit-pack-card.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'vi-VN' }],

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
