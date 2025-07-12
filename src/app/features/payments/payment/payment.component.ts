import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { PaymentService } from '../service/payment.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { StorageFormatPipe } from '../../../shared/pipes/storage-format.pipe';
import { ExportInvoicePdfComponent } from '../export-invoice-pdf/export-invoice-pdf.component';

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
  private readonly router = inject(Router);
  private readonly paymentService = inject(PaymentService);
  private readonly loadingService = inject(LoadingService);

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
