import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { ExportInvoicePdfComponent } from '../export-invoice-pdf/export-invoice-pdf.component';
import { StorageFormatPipe } from '../../../shared/pipes/storage-format.pipe';
import { PaymentService } from '../service/payment.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    StorageFormatPipe,
    CommonModule,
    ExportInvoicePdfComponent,
  ],
  providers: [DatePipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
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

  get deductedAmount() {
    const amount = this.schoolSubscriptionDetail()?.paymentTransaction.amount;
    const planPrice = this.schoolSubscriptionDetail()?.plan.price;

    if (!amount || !planPrice) return 0;

    const deductedAmount = amount - planPrice;

    return deductedAmount;
  }

  private loadData(): void {
    const currentUrl = this.router.url;
    const paymentType = currentUrl.split('/')[3];

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
