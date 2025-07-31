import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DashboardResponse } from '../../../shared/models/api/response/query/dashboard-response.model';

interface ActiveSchool {
  id: number;
  name: string;
  userCount: number;
  lessonCount: number;
  hasActiveSubscription: boolean;
}

@Component({
  selector: 'app-top-active-schools',
  standalone: true,
  imports: [CommonModule, TableModule, RouterLink, TooltipModule],
  templateUrl: './top-active-schools.component.html',
  styleUrls: ['./top-active-schools.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopActiveSchoolsComponent {
  readonly dashboardData = input.required<DashboardResponse | null>();

  activeSchools = computed<ActiveSchool[]>(() => {
    const data = this.dashboardData();
    if (!data?.topSchools) {
      return [];
    }

    return data.topSchools.map(school => ({
      id: school.schoolId,
      name: school.schoolName,
      userCount: school.userCount,
      lessonCount: school.lessonCount,
      hasActiveSubscription: school.hasActiveSubscription,
    }));
  });
}
