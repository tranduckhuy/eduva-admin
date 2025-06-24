import {
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
  signal,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import localeVi from '@angular/common/locales/vi';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Select } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PricingPlanService } from './service/pricing-plan.service';
import { PricingPlanParams } from './model/pricing-plan-params.model';
import { PRICING_PLANS_LIMIT } from '../../shared/constants/common.constant';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { TableSkeletonComponent } from '../../shared/components/skeleton/table-skeleton/table-skeleton.component';

registerLocaleData(localeVi);

interface StatusOption {
  name: string;
  code: number | undefined;
}

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
    FormsModule,
    Select,
    TableSkeletonComponent,
  ],
  templateUrl: './pricing-plans.component.html',
  styleUrl: './pricing-plans.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'vi-VN' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlansComponent implements OnInit {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly pricingPlanService = inject(PricingPlanService);
  private readonly loadingService = inject(LoadingService);

  // Pagination & Sorting signals
  first = signal<number>(0);
  rows = signal<number>(PRICING_PLANS_LIMIT);
  sortField = signal<string | null>(null);
  sortOrder = signal<number>(1); // 1 = asc, -1 = desc
  statusSelect = signal<StatusOption | undefined>(undefined);
  searchTerm = signal<string>('');
  tableHeadSkeleton = signal([
    'STT',
    'Tên',
    'Dung lượng',
    'Số lượng tài khoản',
    'Gói tháng',
    'Gói năm ',
    'Trạng thái',
    'Hành động',
  ]);

  readonly statusSelectOptions = signal<StatusOption[]>([
    { name: 'Đang hoạt động', code: 0 },
    { name: 'Vô hiệu hóa', code: 1 },
    { name: 'Tất cả', code: undefined },
  ]);

  isLoading = this.loadingService.is('get-pricing-plans');

  // Signals from service
  pricingPlans = this.pricingPlanService.pricingPlans;
  totalPricingPlans = this.pricingPlanService.totalPricingPlans;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    const params: PricingPlanParams = {
      pageIndex: Math.floor(this.first() / this.rows()) + 1,
      pageSize: this.rows(),
      searchTerm: this.searchTerm(),
      sortBy: this.sortField() ?? undefined,
      sortDirection: this.sortOrder() === 1 ? 'asc' : 'desc',
      activeOnly: this.getActiveOnlyStatus(),
    };

    this.pricingPlanService.getPricingPlans(params).subscribe();
  }

  private getActiveOnlyStatus(): boolean | undefined {
    const statusCode = this.statusSelect()?.code;
    if (statusCode === 0) return true;
    if (statusCode === 1) return false;
    return undefined;
  }

  loadDataLazy(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? PRICING_PLANS_LIMIT;

    // Handle sorting
    if (event.sortField) {
      this.sortField.set(
        Array.isArray(event.sortField) ? event.sortField[0] : event.sortField
      );
      this.sortOrder.set(event.sortOrder ?? 1);
    }

    this.first.set(first);
    this.rows.set(rows);
    this.loadData();
  }

  onStatusSelectChange(selected: StatusOption | undefined): void {
    this.statusSelect.set(selected);
    this.first.set(0); // Reset to first page when filter changes
    this.loadData();
  }

  onSearchTriggered(term: string): void {
    this.searchTerm.set(term);
    this.sortField.set(null);
    this.sortOrder.set(1);
    this.first.set(0); // Reset to first page when search changes
    this.loadData();
  }

  openConfirmDialog(event: Event, pricingPlanId: string): void {
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
      accept: () => {
        this.disablePricingPlan(pricingPlanId);
      },
    });
  }

  private disablePricingPlan(id: string): void {
    // Implement your disable logic here
    // After disabling, reload the data
    this.loadData();
  }
}
