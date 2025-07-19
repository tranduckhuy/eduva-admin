import { PeriodType } from '../../../enum/period-type.enum';

export interface DashboardRequest {
  startDate?: string;
  endDate?: string;
  lessonActivityPeriod?: PeriodType;
  userRegistrationPeriod?: PeriodType;
  revenuePeriod?: PeriodType;
  topSchoolsCount?: number;
}
