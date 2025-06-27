import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import localeVi from '@angular/common/locales/vi';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Select } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { TableSkeletonComponent } from '../../shared/components/skeleton/table-skeleton/table-skeleton.component';
import { EntityListParams } from '../../shared/models/common/entity-list-params';
import { SUBSCRIPTION_PLANS_LIMIT } from '../../shared/constants/common.constant';
import { SubscriptionPlanService } from './service/subscription-plan.service';
import { StorageFormatPipe } from '../../shared/pipes/storage-format.pipe';

interface StatusOption {
  name: string;
  code: number | undefined;
}

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [
    CurrencyPipe,
    SearchInputComponent,
    BadgeComponent,
    ButtonComponent,
    TableModule,
    LeadingZeroPipe,
    StorageFormatPipe,
    TooltipModule,
    RouterLink,
    FormsModule,
    Select,
    TableSkeletonComponent,
  ],
  templateUrl: './subscription-plans.component.html',
  styleUrl: './subscription-plans.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPlansComponent implements OnInit {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly subscriptionPlanService = inject(SubscriptionPlanService);
  private readonly loadingService = inject(LoadingService);

  // Pagination & Sorting signals
  first = signal<number>(0);
  rows = signal<number>(SUBSCRIPTION_PLANS_LIMIT);
  sortField = signal<string | null>(null);
  sortOrder = signal<number>(0); // 1 = asc, -1 = desc
  statusSelect = signal<StatusOption | undefined>(undefined);
  selectedTimeFilter = signal<
    { name: string; value: string | undefined } | undefined
  >(undefined);
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
    { name: 'Vô hiệu hóa', code: 3 },
    { name: 'Tất cả', code: undefined },
  ]);

  readonly timeFilterOptions = signal([
    { name: 'Mới nhất', value: 'desc' },
    { name: 'Cũ nhất', value: 'asc' },
  ]);

  // Signals from service
  isLoadingGet = this.loadingService.is('get-subscription-plans');
  isLoadingArchive = this.loadingService.is('archive-subscription-plan');
  isLoadingActive = this.loadingService.is('active-subscription-plan');

  subscriptionPlans = this.subscriptionPlanService.subscriptionPlans;
  totalSubscriptionPlans = this.subscriptionPlanService.totalSubscriptionPlans;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    const params: EntityListParams = {
      pageIndex: Math.floor(this.first() / this.rows()) + 1,
      pageSize: this.rows(),
      searchTerm: this.searchTerm(),
      sortBy: this.sortField() ?? 'createdAt',
      sortDirection: this.sortOrder() === 1 ? 'asc' : 'desc',
      activeOnly: this.getActiveOnlyStatus(),
    };

    this.subscriptionPlanService.getSubscriptionPlans(params).subscribe();
  }

  private getActiveOnlyStatus(): boolean | undefined {
    const statusCode = this.statusSelect()?.code;
    if (statusCode === 0) return true;
    if (statusCode === 3) return false;
    return undefined;
  }

  onTimeFilterChange(
    selected: { name: string; value: string | undefined } | undefined
  ): void {
    this.selectedTimeFilter.set(selected);

    if (selected?.value) {
      this.sortField.set('createdAt');
      this.sortOrder.set(selected.value === 'desc' ? -1 : 1);
    } else {
      this.sortField.set(null);
      this.sortOrder.set(1);
    }

    this.first.set(0);
    this.loadData();
  }

  loadDataLazy(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? SUBSCRIPTION_PLANS_LIMIT;

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

  openConfirmArchiveDialog(event: Event, subscriptionPlanId: string): void {
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
        this.subscriptionPlanService
          .archiveSubscriptionPlan(subscriptionPlanId)
          .subscribe({
            next: () => this.loadData(),
          });
      },
    });
  }
  openConfirmActiveDialog(event: Event, subscriptionPlanId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn kích hoạt gói đăng ký này không?',
      header: 'Kích hoạt gói đăng ký',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Hủy',
      rejectButtonProps: {
        label: 'Hủy',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Xác nhận',
      },
      accept: () => {
        this.subscriptionPlanService
          .activateSubscriptionPlan(subscriptionPlanId)
          .subscribe({
            next: () => this.loadData(),
          });
      },
    });
  }
}
