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

import { USERS_LIMIT } from '../../shared/constants/common.constant';
import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';
import { UserService } from '../../shared/services/api/user/user.service';
import { UserListParams } from '../../shared/models/common/user-list-params';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { TableSkeletonComponent } from '../../shared/components/skeleton/table-skeleton/table-skeleton.component';
import { EntityStatus } from '../../shared/models/enum/entity-status.enum';
import { TableEmptyStateComponent } from '../../shared/components/table-empty-state/table-empty-state.component';

interface StatusOption {
  name: string;
  code: number | undefined;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    SearchInputComponent,
    BadgeComponent,
    ButtonComponent,
    TableModule,
    LeadingZeroPipe,
    RouterLink,
    TooltipModule,
    FormsModule,
    SelectModule,
    TableSkeletonComponent,
    TableEmptyStateComponent,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsComponent {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);

  // Pagination & Sorting signals
  first = signal<number>(0);
  rows = signal<number>(USERS_LIMIT);
  sortField = signal<string | null>(null);
  sortOrder = signal<number>(-1); // 1 = asc, -1 = desc
  statusSelect = signal<StatusOption | undefined>(undefined);
  selectedTimeFilter = signal<
    { name: string; value: string | undefined } | undefined
  >(undefined);
  searchTerm = signal<string>('');
  tableHeadSkeleton = signal([
    'STT',
    'Học sinh',
    'Số điện thoại',
    'Email',
    'Trạng thái',
    'Hành động',
  ]);

  readonly statusSelectOptions = signal<StatusOption[]>([
    { name: 'Đang hoạt động', code: EntityStatus.Active },
    { name: 'Vô hiệu hóa', code: EntityStatus.InActive },
    { name: 'Tất cả', code: undefined },
  ]);

  readonly timeFilterOptions = signal([
    { name: 'Mới nhất', value: 'desc' },
    { name: 'Cũ nhất', value: 'asc' },
  ]);

  // Signals from service
  isLoadingGet = this.loadingService.is('get-users');
  isLoadingArchive = this.loadingService.is('archive-user');
  isLoadingActive = this.loadingService.is('active-user');

  users = this.userService.users;
  totalUsers = this.userService.totalUsers;

  private loadData(): void {
    const params: UserListParams = {
      role: 4,
      pageIndex: Math.floor(this.first() / this.rows()) + 1,
      pageSize: this.rows(),
      searchTerm: this.searchTerm(),
      sortBy: this.sortField() ?? 'createdAt',
      sortDirection: this.sortOrder() === 1 ? 'asc' : 'desc',
      status: this.statusSelect()?.code,
    };

    this.userService.getUsers(params).subscribe();
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
      this.sortOrder.set(-1);
    }

    this.first.set(0);
    this.loadData();
  }

  loadDataLazy(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? USERS_LIMIT;

    // Handle sorting
    if (event.sortField) {
      this.sortField.set(
        Array.isArray(event.sortField) ? event.sortField[0] : event.sortField
      );
      this.sortOrder.set(event.sortOrder ?? -1);
    }

    this.first.set(first);
    this.rows.set(rows);
    this.loadData();
  }

  onStatusSelectChange(selected: StatusOption | undefined): void {
    this.statusSelect.set(selected);
    this.first.set(0);
    this.loadData();
  }

  onSearchTriggered(term: string): void {
    this.searchTerm.set(term);
    this.sortField.set(null);
    this.sortOrder.set(-1);
    this.first.set(0); // Reset to first page when search changes
    this.loadData();
  }

  openConfirmArchiveDialog(event: Event, userId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn vô hiệu hóa người dùng này không?',
      header: 'Vô hiệu hóa người dùng',
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
        this.userService.archiveUser(userId).subscribe({
          next: () => this.loadData(),
        });
      },
    });
  }
  openConfirmActiveDialog(event: Event, userId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn kích hoạt người dùng này không?',
      header: 'Kích hoạt người dùng',
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
        this.userService.activateUser(userId).subscribe({
          next: () => this.loadData(),
        });
      },
    });
  }
}
