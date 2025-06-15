import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { LeadingZeroPipe } from '../../../shared/pipes/leading-zero.pipe';
import { RouterLink } from '@angular/router';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { TooltipModule } from 'primeng/tooltip';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';

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
    DialogComponent,
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
      price: 1000000,
      billingCycle: 'monthly',
      status: 'active',
    },
    {
      id: 2,
      name: 'Basic Yearly',
      description: 'Gói cơ bản, phù hợp với trường nhỏ (thanh toán theo năm)',
      creditLimit: 500,
      maxAccounts: 10,
      price: 11000000,
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      id: 3,
      name: 'Standard Monthly',
      description:
        'Gói tiêu chuẩn, phù hợp với trường vừa (thanh toán theo tháng)',
      creditLimit: 1500,
      maxAccounts: 30,
      price: 2500000,
      billingCycle: 'monthly',
      status: 'active',
    },
    {
      id: 4,
      name: 'Standard Yearly',
      description:
        'Gói tiêu chuẩn, phù hợp với trường vừa (thanh toán theo năm)',
      creditLimit: 1500,
      maxAccounts: 30,
      price: 27000000,
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      id: 5,
      name: 'Professional Monthly',
      description:
        'Gói chuyên nghiệp, nhiều tính năng hơn (thanh toán theo tháng)',
      creditLimit: 5000,
      maxAccounts: 100,
      price: 6000000,
      billingCycle: 'monthly',
      status: 'active',
    },
  ];

  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  first = signal<number>(0);
  rows = signal<number>(10);

  @ViewChild('unarchiveDialogRef') unarchiveDialogRef!: DialogComponent;

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

  openUnarchiveDialog() {
    this.unarchiveDialogRef.showDialog();
  }

  get pagedPricingPlans() {
    return this.pricingPlans.slice(this.first(), this.first() + this.rows());
  }
}
