import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  OnInit,
} from '@angular/core';

import { StatCardComponent } from './stat-card/stat-card.component';
import { UserRegistrationTrendComponent } from './user-registration-trend/user-registration-trend.component';
import { LessonCreationComponent } from './lesson-creation/lesson-creation.component';
import { RevenueTrendComponent } from './revenue-trend/revenue-trend.component';
import { TopActiveSchoolsComponent } from './top-active-schools/top-active-schools.component';
import { DashboardService } from './service/dashboard.service';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { PeriodType } from '../../shared/models/enum/period-type.enum';

interface StatCard {
  title: string;
  description: string;
  value: number;
  compareValue?: number;
  unit?: string;
  isRevenue?: boolean;
  icon: string;
  iconColor: string;
  subItems?: SubItem[];
}

interface SubItem {
  title: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    StatCardComponent,
    UserRegistrationTrendComponent,
    LessonCreationComponent,
    RevenueTrendComponent,
    TopActiveSchoolsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly loadingService = inject(LoadingService);

  readonly dashboardData = this.dashboardService.dashboardData;
  readonly isLoadingDashboard = this.loadingService.is('dashboard');

  ngOnInit() {
    this.dashboardService
      .getDashboardData({
        lessonActivityPeriod: PeriodType.Week, // Default to weekly view
        userRegistrationPeriod: PeriodType.Day, // Default to daily view for registration
        revenuePeriod: PeriodType.Month, // Default to monthly view for revenue
      })
      .subscribe({
        next: value => {
          console.log('Dashboard data loaded:', value);
        },
        error: error => {
          console.error('Error loading dashboard data:', error);
        },
      });
  }

  readonly usersStatCard = computed<StatCard>(() => {
    const data = this.dashboardData();
    return {
      title: 'Người dùng',
      description: 'Số lượng người dùng',
      value:
        (data?.systemOverview.totalUsers ?? 0) -
        (data?.systemOverview.systemAdmins ?? 0),
      icon: 'group',
      iconColor: 'text-primary',
      subItems: [
        {
          title: 'School Admins',
          value: data?.systemOverview.schoolAdmins ?? 0,
        },
        {
          title: 'Giáo viên / Kiểm duyệt viên',
          value:
            (data?.systemOverview.teachers ?? 0) +
            (data?.systemOverview.contentModerators ?? 0),
        },
        { title: 'Học sinh', value: data?.systemOverview.students ?? 0 },
      ],
    };
  });

  readonly lessonsStatCard = computed<StatCard>(() => {
    const data = this.dashboardData();
    return {
      title: 'Bài học',
      description: 'Số lượng bài học',
      value: data?.systemOverview.totalLessons ?? 0,
      icon: 'book_ribbon',
      iconColor: 'text-success',
      subItems: [
        {
          title: 'Bài học được tải lên',
          value: data?.systemOverview.uploadedLessons ?? 0,
        },
        {
          title: 'Bài học tạo bằng AI',
          value: data?.systemOverview.aiGeneratedLessons ?? 0,
        },
      ],
    };
  });

  readonly storageStatCard = computed<StatCard>(() => {
    const data = this.dashboardData();
    return {
      title: 'Dung lượng (GB)',
      description: 'Dung lượng đã sử dụng',
      value: data?.systemOverview.totalStorageUsedGB ?? 0,
      icon: 'database',
      unit: 'GB',
      iconColor: 'text-danger',
    };
  });

  readonly schoolsStatCard = computed<StatCard>(() => {
    const data = this.dashboardData();
    return {
      title: 'Trường học',
      description: 'Số lượng trường học',
      value: data?.systemOverview.totalSchools ?? 0,
      icon: 'school',
      iconColor: 'text-danger',
    };
  });

  readonly pricingPlanRevenueStatCard = computed<StatCard>(() => {
    const data = this.dashboardData();
    return {
      title: 'Credit',
      description: 'Doanh thu credit',
      value: data?.systemOverview.creditPackRevenue ?? 0,
      icon: 'paid',
      isRevenue: true,
      iconColor: 'text-warning',
    };
  });

  readonly subscriptionRevenueStatCard = computed<StatCard>(() => {
    const data = this.dashboardData();
    return {
      title: 'Subscription',
      description: 'Doanh thu subscription plan',
      value: data?.systemOverview.subscriptionPlanRevenue ?? 0,
      icon: 'paid',
      isRevenue: true,
      iconColor: 'text-warning',
    };
  });
}
