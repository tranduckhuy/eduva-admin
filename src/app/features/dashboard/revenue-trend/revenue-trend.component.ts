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
  ApexFill,
  NgApexchartsModule,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ApexGrid,
  ApexDataLabels,
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
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  colors: string[];
};

interface SelectOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-revenue-trend',
  standalone: true,
  imports: [NgApexchartsModule, FormsModule, Select],
  templateUrl: './revenue-trend.component.html',
  styleUrl: './revenue-trend.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueTrendComponent {
  private readonly dashboardService = inject(DashboardService);

  dashboardData = input.required<DashboardResponse | null>();

  timeSelect = signal<SelectOption>({ name: 'Theo tháng', code: 'monthly' });
  isChangingPeriod = signal<boolean>(false);
  lastRequestedPeriod = signal<PeriodType>(PeriodType.Month);

  readonly timeSelectOptions = signal<SelectOption[]>([
    { name: 'Theo tháng', code: 'monthly' },
    { name: 'Theo năm', code: 'yearly' },
  ]);

  constructor() {
    // Effect to detect when dashboard data changes and ensure timeSelect matches the data
    effect(
      () => {
        const data = this.dashboardData();

        if (data && data.revenueStats && data.revenueStats.length > 0) {
          // Check if the data format matches the current selection
          const firstPeriod = data.revenueStats[0].period;
          const isMonthlyData = firstPeriod.match(/^\d{4}-\d{2}$/);
          const isYearlyData = firstPeriod.match(/^\d{4}$/);

          // Update timeSelect to match the actual data format
          if (isMonthlyData && this.timeSelect().code !== 'monthly') {
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

    if (!data || !data.revenueStats) {
      return [];
    }

    return this.generateChartData(data.revenueStats, timeSelectValue.code);
  });

  // Computed chart options that react to chart data changes
  readonly chartOptions = computed<ChartOptions>(() => {
    const chartData = this.chartData();
    const timeSelectValue = this.timeSelect();

    return {
      series: [
        {
          name: 'Credit Points',
          data: chartData.map(item => ({
            ...item,
            y: item.meta?.creditPackRevenue || 0,
          })),
        },
        {
          name: 'Subscription Plan',
          data: chartData.map(item => ({
            ...item,
            y: item.meta?.subscriptionRevenue || 0,
          })),
        },
      ],
      chart: {
        type: 'line',
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
      colors: ['#467fcf', '#5eba00'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => `${this.formatVND(val)}`,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: (value: string) => {
            if (timeSelectValue.code === 'monthly') {
              return new Date(value).toLocaleDateString('vi-VN', {
                month: 'short',
                year: 'numeric',
              });
            } else {
              return new Date(value).getFullYear().toString();
            }
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `${this.formatVND(value)}`,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3,
      },
    };
  });

  private formatVND(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

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
      revenuePeriod: periodType,
    };

    this.dashboardService.getDashboardData(request).subscribe({
      next: data => {
        console.log(
          'Dashboard data updated for revenue period:',
          selected.code,
          data
        );
        this.isChangingPeriod.set(false);
      },
      error: error => {
        console.error('Error updating dashboard data:', error);
        this.isChangingPeriod.set(false);
        // Revert the selection on error
        this.timeSelect.set({ name: 'Theo tháng', code: 'monthly' });
        this.lastRequestedPeriod.set(PeriodType.Month);
      },
    });
  }

  private getPeriodTypeFromCode(code: string): PeriodType {
    switch (code) {
      case 'monthly':
        return PeriodType.Month;
      case 'yearly':
        return PeriodType.Year;
      default:
        return PeriodType.Month;
    }
  }

  private generateChartData(
    revenueStats: any[],
    periodType: string
  ): DataPoint[] {
    if (!revenueStats || revenueStats.length === 0) {
      return [];
    }

    return revenueStats.map(stat => {
      const date = this.parsePeriodToDate(stat.period, periodType);

      return {
        x: date.getTime(),
        y: stat.totalRevenue,
        fill: {
          type: 'solid',
        },
        meta: {
          creditPackRevenue: stat.creditPackRevenue || 0,
          subscriptionRevenue: stat.subscriptionRevenue || 0,
          totalRevenue: stat.totalRevenue || 0,
        },
      };
    });
  }

  private parsePeriodToDate(period: string, periodType: string): Date {
    switch (periodType) {
      case 'monthly':
        // Format: "YYYY-MM"
        const [year, month] = period.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, 1);
      case 'yearly':
        // Format: "YYYY"
        return new Date(parseInt(period), 0, 1);
      default:
        return new Date();
    }
  }
}
