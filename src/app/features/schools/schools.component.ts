import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { SchoolService } from './service/school.service';
import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SCHOOLS_LIMIT } from '../../shared/constants/common.constant';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { EntityListParams } from '../../shared/models/common/entity-list-params';
import { TableSkeletonComponent } from '../../shared/components/skeleton/table-skeleton/table-skeleton.component';

interface StatusOption {
  name: string;
  code: number | undefined;
}

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [
    SearchInputComponent,
    TableModule,
    LeadingZeroPipe,
    BadgeComponent,
    ButtonComponent,
    TooltipModule,
    SelectModule,
    FormsModule,
    RouterLink,
    TableSkeletonComponent,
  ],
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolsComponent {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly schoolService = inject(SchoolService);
  private readonly loadingService = inject(LoadingService);

  // Pagination & Sorting signals
  first = signal<number>(0);
  rows = signal<number>(SCHOOLS_LIMIT);
  sortField = signal<string | null>(null);
  sortOrder = signal<number>(1); // 1 = asc, -1 = desc
  statusSelect = signal<StatusOption | undefined>(undefined);
  selectedTimeFilter = signal<
    { name: string; value: string | undefined } | undefined
  >(undefined);
  searchTerm = signal<string>('');
  tableHeadSkeleton = signal([
    'STT',
    'Tên',
    'Địa chỉ',
    'Số điện thoại',
    'Email',
    'Hành động ',
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
    { name: 'Tất cả', value: undefined },
  ]);

  // Signals from service
  isLoadingGet = this.loadingService.is('get-Schools');
  isLoadingArchive = this.loadingService.is('archive-school');
  isLoadingActive = this.loadingService.is('active-school');

  schools = this.schoolService.schools;
  totalSchools = this.schoolService.totalSchools;

  private loadData(): void {
    const params: EntityListParams = {
      pageIndex: Math.floor(this.first() / this.rows()) + 1,
      pageSize: this.rows(),
      searchTerm: this.searchTerm(),
      sortBy: this.sortField() ?? undefined,
      sortDirection: this.sortOrder() === 1 ? 'asc' : 'desc',
      activeOnly: this.getActiveOnlyStatus(),
    };

    this.schoolService.getSchools(params).subscribe();
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
    const rows = event.rows ?? SCHOOLS_LIMIT;

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

  openConfirmArchiveDialog(event: Event, schoolId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn vô hiệu hóa trường học này không?',
      header: 'Vô hiệu hóa trường học',
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
        this.schoolService.archiveSchool(schoolId).subscribe({
          next: () => this.loadData(),
        });
      },
    });
  }
  openConfirmActiveDialog(event: Event, schoolId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn kích hoạt trường học này không?',
      header: 'Kích hoạt trường học',
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
        this.schoolService.activateSchool(schoolId).subscribe({
          next: () => this.loadData(),
        });
      },
    });
  }
}
