import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import localeVi from '@angular/common/locales/vi';

import { TableModule } from 'primeng/table';

import { Invoice } from '../../../shared/models/entities/invoice.model';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TableModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceComponent {
  invoice: Invoice = {
    id: 1,
    client: {
      id: 101,
      name: 'Nguyễn Văn An',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      email: 'an.nguyen@example.com',
      phoneNumber: '+84901234567',
    },
    school: {
      id: 'SCH001',
      name: 'Trường THPT Nguyễn Trãi',
    },
    amount: 1500000,
    pricingPlan: {
      id: 'PP001',
      name: 'Gói Cơ Bản',
      description: 'Gói đăng ký hàng tháng cơ bản',
      price: 1500000,
      creditLimit: 100,
      storageLimit: 10,
      maxAccounts: 5,
      billingCycle: 'monthly',
    },
    status: 'paid',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
  };

  constructor(private readonly datePipe: DatePipe) {}

  formatDateVi(date: Date | string): string {
    return this.datePipe.transform(date, 'medium', undefined, 'vi') ?? '';
  }
}
