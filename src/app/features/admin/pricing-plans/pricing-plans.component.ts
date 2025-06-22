import {
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';

import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';

import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LeadingZeroPipe } from '../../../shared/pipes/leading-zero.pipe';

registerLocaleData(localeVi);
@Component({
  selector: 'app-pricing-plans',
  standalone: true,
  imports: [
    CurrencyPipe,
    SearchInputComponent,
    BadgeComponent,
    ButtonComponent,
    TableModule,
    LeadingZeroPipe,
    TooltipModule,
    RouterLink,
  ],
  templateUrl: './pricing-plans.component.html',
  styleUrl: './pricing-plans.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'vi-VN' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlansComponent {
  pricingPlans = [
    {
      id: 1,
      name: 'Basic Monthly',
      description: 'Gói cơ bản, phù hợp với trường nhỏ (thanh toán theo tháng)',
      creditLimit: 500,
      maxAccounts: 10,
      storageLimit: 50, // GB
      price: 1000000,
      billingCycle: 'monthly',
      status: 'active',
    },
    {
      id: 2,
      name: 'Standard Monthly',
      description:
        'Gói tiêu chuẩn, phù hợp với trường vừa (thanh toán theo tháng)',
      creditLimit: 1500,
      maxAccounts: 30,
      storageLimit: 150, // GB
      price: 2500000,
      billingCycle: 'monthly',
      status: 'active',
    },
    {
      id: 3,
      name: 'Professional Monthly',
      description:
        'Gói chuyên nghiệp, nhiều tính năng hơn (thanh toán theo tháng)',
      creditLimit: 5000,
      maxAccounts: 100,
      storageLimit: 500, // GB
      price: 6000000,
      billingCycle: 'monthly',
      status: 'active',
    },
    {
      id: 4,
      name: 'Enterprise Monthly',
      description: 'Gói doanh nghiệp, dung lượng lớn (thanh toán theo tháng)',
      creditLimit: 15000,
      maxAccounts: 300,
      storageLimit: 2000, // GB (2 TB)
      price: 15000000,
      billingCycle: 'monthly',
      status: 'active',
    },
    {
      id: 5,
      name: 'Ultimate Monthly',
      description: 'Gói tối ưu nhất, hỗ trợ toàn diện (thanh toán theo tháng)',
      creditLimit: 30000,
      maxAccounts: 500,
      storageLimit: 5000, // GB (5 TB)
      price: 25000000,
      billingCycle: 'monthly',
      status: 'active',
    },

    {
      id: 6,
      name: 'Basic Yearly',
      description: 'Gói cơ bản, phù hợp với trường nhỏ (thanh toán theo năm)',
      creditLimit: 500,
      maxAccounts: 10,
      storageLimit: 50, // GB
      price: 11000000,
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      id: 7,
      name: 'Standard Yearly',
      description:
        'Gói tiêu chuẩn, phù hợp với trường vừa (thanh toán theo năm)',
      creditLimit: 1500,
      maxAccounts: 30,
      storageLimit: 150, // GB
      price: 27000000,
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      id: 8,
      name: 'Professional Yearly',
      description:
        'Gói chuyên nghiệp, nhiều tính năng hơn (thanh toán theo năm)',
      creditLimit: 5000,
      maxAccounts: 100,
      storageLimit: 500, // GB
      price: 66000000,
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      id: 9,
      name: 'Enterprise Yearly',
      description: 'Gói doanh nghiệp, dung lượng lớn (thanh toán theo năm)',
      creditLimit: 15000,
      maxAccounts: 300,
      storageLimit: 2000, // GB
      price: 165000000,
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      id: 10,
      name: 'Ultimate Yearly',
      description: 'Gói tối ưu nhất, hỗ trợ toàn diện (thanh toán theo năm)',
      creditLimit: 30000,
      maxAccounts: 500,
      storageLimit: 5000, // GB
      price: 275000000,
      billingCycle: 'yearly',
      status: 'active',
    },
  ];

  private readonly confirmationService = inject(ConfirmationService);

  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  first = signal<number>(0);
  rows = signal<number>(10);

  get pagedPricingPlans() {
    return this.pricingPlans.slice(this.first(), this.first() + this.rows());
  }

  ngOnInit(): void {
    this.totalRecords.set(this.pricingPlans.length);
  }

  loadProductsLazy(event: TableLazyLoadEvent) {}

  onSearchTriggered(term: string) {}

  next() {
    this.first.set(this.first() + this.rows());
  }

  prev() {
    this.first.set(this.first() - this.rows());
  }

  reset() {
    this.first.set(0);
  }

  pageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  isLastPage(): boolean {
    return this.pricingPlans
      ? this.first() + this.rows() >= this.pricingPlans.length
      : true;
  }

  isFirstPage(): boolean {
    return this.pricingPlans ? this.first() === 0 : true;
  }

  openConfirmDialog(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn vô hiệu hóa gói đăng ký này không?',
      header: 'Vô hiệu hóa gói đăng ký',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Hủy',
      rejectButtonProps: {
        label: 'Hủy',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Xác nhận',
        severity: 'danger',
      },

      accept: () => {},
      reject: () => {},
    });
  }
}
