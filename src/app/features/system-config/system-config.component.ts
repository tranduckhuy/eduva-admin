import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableEmptyStateComponent } from '../../shared/components/table-empty-state/table-empty-state.component';
import { SystemConfigService } from './service/system-config.service';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { TableSkeletonComponent } from '../../shared/components/skeleton/table-skeleton/table-skeleton.component';
import { SystemConfig } from '../../shared/models/entities/system-config.model';
import { ToastHandlingService } from '../../shared/services/core/toast/toast-handling.service';

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    CommonModule,
    LeadingZeroPipe,
    TooltipModule,
    FormsModule,
    ButtonComponent,
    TableEmptyStateComponent,
    TableSkeletonComponent,
    DatePipe,
  ],
  templateUrl: './system-config.component.html',
  styleUrl: './system-config.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemConfigComponent implements OnInit {
  private readonly systemConfigService = inject(SystemConfigService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastHandlingService);

  tableHeadSkeleton = signal([
    'STT',
    'Mã',
    'Cập nhật gần nhất',
    'Giá trị',
    'Mô tả',
    '',
  ]);

  // Signals from service
  isLoadingGet = this.loadingService.is('get-system-config');
  isLoadingUpdate = this.loadingService.is('update-system-config');
  systemConfig = this.systemConfigService.systemConfig;

  clonedItems: { [s: string]: SystemConfig } = {};

  ngOnInit() {
    this.systemConfigService.getSystemConfig().subscribe();
  }

  onRowEditInit(systemConfig: SystemConfig) {
    this.clonedItems[systemConfig.id] = { ...systemConfig };
  }

  onRowEditSave(systemConfig: SystemConfig) {
    if (systemConfig.value && systemConfig.description) {
      delete this.clonedItems[systemConfig.id];
      this.systemConfigService
        .updateSystemConfig(systemConfig.key, {
          key: systemConfig.key,
          value: systemConfig.value,
          description: systemConfig.description,
        })
        .subscribe({
          next: () => {
            this.systemConfigService.getSystemConfig().subscribe();
          },
        });
    } else {
      const currentIndex = this.systemConfig().findIndex(
        item => item.id === systemConfig.id
      );
      if (currentIndex !== -1) {
        this.systemConfig()[currentIndex] = this.clonedItems[systemConfig.id];
      }

      this.toastService.error(
        'Cập nhật cấu hình hệ thống thất bại',
        'Vui lòng điền đầy đủ thông tin giá trị và mô tả.'
      );
    }
  }

  onRowEditCancel(systemConfig: SystemConfig, index: number) {
    this.systemConfig()[index] = this.clonedItems[systemConfig.id];
    delete this.clonedItems[systemConfig.id];
  }
}
