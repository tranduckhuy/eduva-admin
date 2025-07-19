import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  computed,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { Select } from 'primeng/select';
import { DashboardResponse } from '../../../shared/models/api/response/query/dashboard-response.model';
import { DashboardService } from '../service/dashboard.service';
import { PeriodType } from '../../../shared/models/enum/period-type.enum';

type DataPoint = {
  x: number;
  y: number;
  fill: ApexFill;
  fillColor?: string;
  strokeColor?: string;
  meta?: any;
  goals?: any;
  barHeightOffset?: number;
  columnWidthOffset?: number;
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  annotations: ApexAnnotations;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  colors: string[];
};

interface SelectOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-user-registration-trend',
  standalone: true,
  imports: [NgApexchartsModule, FormsModule, Select],
  templateUrl: './user-registration-trend.component.html',
  styleUrl: './user-registration-trend.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegistrationTrendComponent {
  private readonly dashboardService = inject(DashboardService);

  dashboardData = input.required<DashboardResponse | null>();

  timeSelect = signal<SelectOption>({ name: 'Theo ngày', code: 'daily' });
  isChangingPeriod = signal<boolean>(false);
  lastRequestedPeriod = signal<PeriodType>(PeriodType.Day);

  readonly timeSelectOptions = signal<SelectOption[]>([
    { name: 'Theo ngày', code: 'daily' },
    { name: 'Theo tháng', code: 'monthly' },
    { name: 'Theo năm', code: 'yearly' },
  ]);

  constructor() {
    // Effect to detect when dashboard data changes and ensure timeSelect matches the data
    effect(
      () => {
        const data = this.dashboardData();

        if (data?.userRegistrations?.length) {
          // Check if the data format matches the current selection
          const firstPeriod = data.userRegistrations[0].period;
          const isDailyData = /^\d{4}-\d{2}-\d{2}$/.exec(firstPeriod);
          const isMonthlyData = /^\d{4}-\d{2}$/.exec(firstPeriod);
          const isYearlyData = /^\d{4}$/.exec(firstPeriod);

          // Update timeSelect to match the actual data format
          if (isDailyData && this.timeSelect().code !== 'daily') {
            this.timeSelect.set({ name: 'Theo ngày', code: 'daily' });
          } else if (isMonthlyData && this.timeSelect().code !== 'monthly') {
            this.timeSelect.set({ name: 'Theo tháng', code: 'monthly' });
          } else if (isYearlyData && this.timeSelect().code !== 'yearly') {
            this.timeSelect.set({ name: 'Theo năm', code: 'yearly' });
          }
        }
      },
      { allowSignalWrites: true }
    );
  }

  // Computed chart data that reacts to dashboard data changes
  readonly chartData = computed(() => {
    const data = this.dashboardData();
    const timeSelectValue = this.timeSelect();

    if (!data?.userRegistrations) {
      return [];
    }

    return this.generateChartData(data.userRegistrations, timeSelectValue.code);
  });

  // Computed chart options that react to chart data changes
  readonly chartOptions = computed<ChartOptions>(() => {
    const chartData = this.chartData();
    const timeSelectValue = this.timeSelect();

    return {
      series: [
        {
          name: 'Quản trị viên trường',
          data: chartData.map(item => ({
            ...item,
            y: item.meta?.schoolAdmins ?? 0,
          })),
        },
        {
          name: 'Giáo viên',
          data: chartData.map(item => ({
            ...item,
            y: item.meta?.teachers ?? 0,
          })),
        },
        {
          name: 'Kiểm duyệt viên',
          data: chartData.map(item => ({
            ...item,
            y: item.meta?.contentModerators ?? 0,
          })),
        },
        {
          name: 'Học sinh',
          data: chartData.map(item => ({
            ...item,
            y: item.meta?.students ?? 0,
          })),
        },
      ],
      chart: {
        type: 'area',
        height: 300,
        zoom: { enabled: true },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      colors: ['#467fcf', '#22c03c', '#f59e0b', '#ef4444'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      title: {
        text: '',
        align: 'left',
      },
      markers: {
        size: 5,
        hover: { size: 7 },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => `${val} người dùng`,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: (value: string) => {
            const date = new Date(value);
            if (timeSelectValue.code === 'daily') {
              return date.toLocaleDateString('vi-VN');
            } else if (timeSelectValue.code === 'monthly') {
              return date.toLocaleDateString('vi-VN', {
                month: 'short',
                year: 'numeric',
              });
            } else {
              return date.getFullYear().toString();
            }
          },
        },
      },
      yaxis: {
        min: 0,
        title: { text: 'Số lượng người dùng' },
      },
      annotations: { points: [] },
    };
  });

  onTimeSelectChange(selected: SelectOption) {
    // Only proceed if the selection actually changed
    if (selected.code === this.timeSelect().code) {
      return;
    }

    this.timeSelect.set(selected);
    this.isChangingPeriod.set(true);

    const periodType = this.getPeriodTypeFromCode(selected.code);
    this.lastRequestedPeriod.set(periodType);

    // Fetch new dashboard data based on the selected period
    const request = {
      userRegistrationPeriod: periodType,
    };

    this.dashboardService.getDashboardData(request).subscribe({
      next: data => {
        console.log(
          'Dashboard data updated for registration period:',
          selected.code,
          data
        );
        this.isChangingPeriod.set(false);
      },
      error: error => {
        console.error('Error updating dashboard data:', error);
        this.isChangingPeriod.set(false);
        // Revert the selection on error
        this.timeSelect.set({ name: 'Theo ngày', code: 'daily' });
        this.lastRequestedPeriod.set(PeriodType.Day);
      },
    });
  }

  private getPeriodTypeFromCode(code: string): PeriodType {
    switch (code) {
      case 'daily':
        return PeriodType.Day;
      case 'monthly':
        return PeriodType.Month;
      case 'yearly':
        return PeriodType.Year;
      default:
        return PeriodType.Day;
    }
  }

  private generateChartData(
    userRegistrations: any[],
    periodType: string
  ): DataPoint[] {
    if (!userRegistrations || userRegistrations.length === 0) {
      return [];
    }

    return userRegistrations.map(registration => {
      const date = this.parsePeriodToDate(registration.period, periodType);

      return {
        x: date.getTime(),
        y: registration.totalRegistrations,
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
        meta: {
          schoolAdmins: registration.schoolAdmins ?? 0,
          teachers: registration.teachers ?? 0,
          contentModerators: registration.contentModerators ?? 0,
          students: registration.students ?? 0,
        },
      };
    });
  }

  private parsePeriodToDate(period: string, periodType: string): Date {
    switch (periodType) {
      case 'daily':
        // Format: "YYYY-MM-DD"
        return new Date(period);
      case 'monthly': {
        // Format: "YYYY-MM"
        const [year, month] = period.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, 1);
      }
      case 'yearly':
        // Format: "YYYY"
        return new Date(parseInt(period), 0, 1);
      default:
        return new Date();
    }
  }
}
