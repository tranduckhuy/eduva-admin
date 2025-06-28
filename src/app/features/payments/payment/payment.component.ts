import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  registerLocaleData,
} from '@angular/common';
import localeVi from '@angular/common/locales/vi';

import { PaymentService } from '../service/payment.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { StorageFormatPipe } from '../../../shared/pipes/storage-format.pipe';

registerLocaleData(localeVi);

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, StorageFormatPipe, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'vi' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  private readonly paymentService = inject(PaymentService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);

  isLoading = this.loadingService;
  schoolSubscriptionDetail = this.paymentService.schoolSubscriptionDetail;
  creditTransactionDetail = this.paymentService.creditTransactionDetail;

  paymentId = input.required<string>({
    alias: 'paymentId',
  });

  isCreditPack = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    const currentUrl = this.router.url;
    const paymentType = currentUrl.split('/')[3];
    console.log(paymentType);

    if (paymentType === 'credit-pack') {
      this.isCreditPack.set(true);
      this.paymentService
        .getCreditTransactionDetailById(this.paymentId())
        .subscribe();
    } else {
      this.isCreditPack.set(false);
      this.paymentService
        .getSchoolSubscriptionDetailById(this.paymentId())
        .subscribe();
    }
  }
}
