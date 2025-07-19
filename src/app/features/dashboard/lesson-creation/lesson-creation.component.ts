import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  computed,
  inject,
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
  ApexDataLabels,
  ApexPlotOptions,
  ApexFill,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DashboardService } from '../service/dashboard.service';
import { getLastNWeekNumbers } from '../../../shared/utils/util-functions';
import { DashboardResponse } from '../../../shared/models/api/response/query/dashboard-response.model';
import { PeriodType } from '../../../shared/models/enum/period-type.enum';

type DataPoint = {
  x: string | number | Date;
  y: number;
  fill: ApexFill;
  fillColor?: string;
  strokeColor?: string;
  meta?: any;
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
};

interface SelectOption {
  name: string;
  code: string;
}

interface TopCreator {
  name: string;
  school: string;
  lessons: number;
  aiGenerated: number;
  uploaded: number;
}

@Component({
  selector: 'app-lesson-creation',
  standalone: true,
  imports: [NgApexchartsModule, FormsModule, Select, TableModule],
  templateUrl: './lesson-creation.component.html',
  styleUrl: './lesson-creation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonCreationComponent {
  private readonly dashboardService = inject(DashboardService);

  dashboardData = input.required<DashboardResponse | null>();

  timeSelect = signal<SelectOption>({ name: 'Theo tuần', code: 'weekly' });
  isChangingPeriod = signal<boolean>(false);
  lastRequestedPeriod = signal<PeriodType>(PeriodType.Week);

  readonly timeSelectOptions = signal<SelectOption[]>([
    { name: 'Theo tuần', code: 'weekly' },
    { name: 'Theo tháng', code: 'monthly' },
  ]);

  topCreators = signal<TopCreator[]>([]);

  constructor() {
    // Effect to detect when dashboard data changes and ensure timeSelect matches the data
    effect(
      () => {
        const data = this.dashboardData();

        if (data && data.lessonActivity && data.lessonActivity.length > 0) {
          // Check if the data format matches the current selection
          const firstPeriod = data.lessonActivity[0].period;
          const isWeeklyData = firstPeriod.includes('-W');
          const isMonthlyData = firstPeriod.match(/^\d{4}-\d{2}$/);

          // Update timeSelect to match the actual data format
          if (isWeeklyData && this.timeSelect().code !== 'weekly') {
            this.timeSelect.set({ name: 'Theo tuần', code: 'weekly' });
          } else if (isMonthlyData && this.timeSelect().code !== 'monthly') {
            this.timeSelect.set({ name: 'Theo tháng', code: 'monthly' });
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

    if (!data) {
      return { ai: [], uploaded: [] };
    }

    if (timeSelectValue.code === 'weekly') {
      return this.generateWeeklyData(7, data);
    } else {
      return this.generateMonthlyData(12, data);
    }
  });

  // Computed chart options that react to chart data changes
  readonly chartOptions = computed<ChartOptions>(() => {
    const chartData = this.chartData();
    const timeSelectValue = this.timeSelect();

    return {
      series: [
        {
          name: 'Tạo bởi AI',
          data: chartData.ai,
        },
        {
          name: 'Tải lên',
          data: chartData.uploaded,
        },
      ],
      chart: {
        type: 'bar',
        height: 400,
        stacked: true,
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
        events: {
          click: (event, chartContext, config) => {
            // Handle bar click for daily breakdown
            // this.handleBarClick(config.dataPointIndex);
          },
        },
      },
      colors: ['#2093e7', '#22c03c'],
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '60%',
          borderRadius: 4,
        },
      },
      fill: {
        opacity: 1,
      },
      title: {
        text: '',
        align: 'left',
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => `${val} bài học`,
        },
      },
      xaxis: {
        type: 'category',
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (value: string | number) => {
            if (timeSelectValue.code === 'weekly') {
              return `Tuần ${value}`;
            } else {
              return value.toString();
            }
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
    };
  });

  onTimeSelectChange(selected: SelectOption) {
    // Only proceed if the selection actually changed
    if (selected.code === this.timeSelect().code) {
      return;
    }

    this.timeSelect.set(selected);
    this.isChangingPeriod.set(true);

    const periodType =
      selected.code === 'weekly' ? PeriodType.Week : PeriodType.Month;
    this.lastRequestedPeriod.set(periodType);

    // Fetch new dashboard data based on the selected period
    const request = {
      lessonActivityPeriod: periodType,
    };

    this.dashboardService.getDashboardData(request).subscribe({
      next: data => {
        console.log('Dashboard data updated for period:', selected.code, data);
        this.isChangingPeriod.set(false);
      },
      error: error => {
        console.error('Error updating dashboard data:', error);
        this.isChangingPeriod.set(false);
        // Revert the selection on error
        this.timeSelect.set({ name: 'Theo tuần', code: 'weekly' });
        this.lastRequestedPeriod.set(PeriodType.Week);
      },
    });
  }

  private handleBarClick(index: number) {
    // Implement logic to show daily breakdown
  }

  private generateWeeklyData(
    weeks: number,
    data: DashboardResponse
  ): {
    ai: DataPoint[];
    uploaded: DataPoint[];
  } {
    const lessonActivities = data?.lessonActivity;

    if (!lessonActivities || lessonActivities.length === 0) {
      return { ai: [], uploaded: [] };
    }

    const lastWeekNumbers = getLastNWeekNumbers(weeks);

    const filterLessonActivitiesByWeeks = lessonActivities.filter(item => {
      const [year, week] = item.period.split('-W');
      return lastWeekNumbers.some(weekNumber => {
        return (
          weekNumber.year === Number(year) && weekNumber.week === Number(week)
        );
      });
    });

    const result = {
      aiData: filterLessonActivitiesByWeeks.map(item => ({
        x: item.period.split('-W')[1],
        y: item.aiGeneratedCount,
        fill: {
          type: 'solid',
        },
      })),
      uploaded: filterLessonActivitiesByWeeks.map(item => ({
        x: item.period.split('-W')[1],
        y: item.uploadedCount,
        fill: {
          type: 'solid',
        },
      })),
    };

    return { ai: result.aiData, uploaded: result.uploaded };
  }

  private generateMonthlyData(
    months: number = 12,
    data: DashboardResponse
  ): {
    ai: DataPoint[];
    uploaded: DataPoint[];
  } {
    const lessonActivities = data?.lessonActivity;

    if (!lessonActivities || lessonActivities.length === 0) {
      return { ai: [], uploaded: [] };
    }

    const monthNames = [
      'Th1',
      'Th2',
      'Th3',
      'Th4',
      'Th5',
      'Th6',
      'Th7',
      'Th8',
      'Th9',
      'Th10',
      'Th11',
      'Th12',
    ];

    const aiData = lessonActivities.map(item => {
      // Handle both "YYYY-MM" and "YYYY-WXX" formats
      const periodParts = item.period.split('-');
      let monthNumber: number;

      if (periodParts.length === 2) {
        // For monthly data, period is "YYYY-MM"
        monthNumber = parseInt(periodParts[1], 10) - 1; // Convert to 0-based index
      } else {
        // Fallback for other formats
        monthNumber = 0;
      }

      return {
        x: monthNames[monthNumber] || `Th${monthNumber + 1}`,
        y: item.aiGeneratedCount,
        fill: {
          type: 'solid',
        },
      };
    });

    const uploadedData = lessonActivities.map(item => {
      // Handle both "YYYY-MM" and "YYYY-WXX" formats
      const periodParts = item.period.split('-');
      let monthNumber: number;

      if (periodParts.length === 2) {
        // For monthly data, period is "YYYY-MM"
        monthNumber = parseInt(periodParts[1], 10) - 1; // Convert to 0-based index
      } else {
        // Fallback for other formats
        monthNumber = 0;
      }

      return {
        x: monthNames[monthNumber] || `Th${monthNumber + 1}`,
        y: item.uploadedCount,
        fill: {
          type: 'solid',
        },
      };
    });

    return { ai: aiData, uploaded: uploadedData };
  }
}

// Add this to your Date prototype for week number calculation
declare global {
  interface Date {
    getWeek(): number;
  }
}

function getWeek(date: Date): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}
