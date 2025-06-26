import { CurrencyPipe, registerLocaleData } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import localeVi from '@angular/common/locales/vi';

import { Select } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { CreditPackService } from './service/credit-pack.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { CREDIT_PACKS_LIMIT } from '../../shared/constants/common.constant';
import { EntityListParams } from '../../shared/models/common/entity-list-params';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { TableSkeletonComponent } from '../../shared/components/skeleton/table-skeleton/table-skeleton.component';

interface StatusOption {
  name: string;
  code: number | undefined;
}

registerLocaleData(localeVi);

@Component({
  selector: 'app-credit-packs',
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
  templateUrl: './credit-packs.component.html',
  styleUrl: './credit-packs.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'vi-VN' }],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPacksComponent {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly creditPackService = inject(CreditPackService);
  private readonly loadingService = inject(LoadingService);

  // Pagination & Sorting signals
  first = signal<number>(0);
  rows = signal<number>(CREDIT_PACKS_LIMIT);
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
    'Giá',
    'Số lượng credit',
    'Credit tặng thêm',
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
  isLoadingGet = this.loadingService.is('get-pricing-plans');
  isLoadingArchive = this.loadingService.is('archive-pricing-plan');
  isLoadingActive = this.loadingService.is('active-pricing-plan');

  creditPacks = this.creditPackService.creditPacks;
  totalCreditPacks = this.creditPackService.totalCreditPack;

  private loadData(): void {
    const params: EntityListParams = {
      pageIndex: Math.floor(this.first() / this.rows()) + 1,
      pageSize: this.rows(),
      searchTerm: this.searchTerm(),
      sortBy: this.sortField() ?? 'createdAt',
      sortDirection: this.sortOrder() === 1 ? 'asc' : 'desc',
      activeOnly: this.getActiveOnlyStatus(),
    };

    this.creditPackService.getCreditPacks(params).subscribe();
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
    const rows = event.rows ?? CREDIT_PACKS_LIMIT;

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

  openConfirmArchiveDialog(event: Event, creditPackId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn vô hiệu hóa gói credit này không?',
      header: 'Vô hiệu hóa gói credit',
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
        this.creditPackService.archiveCreditPack(creditPackId).subscribe({
          next: () => this.loadData(),
        });
      },
    });
  }
  openConfirmActiveDialog(event: Event, creditPackId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn kích hoạt gói credit này không?',
      header: 'Kích hoạt gói credit',
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
        this.creditPackService.activateCreditPack(creditPackId).subscribe({
          next: () => this.loadData(),
        });
      },
    });
  }
}
