interface LessonActivity {
  period: string;
  uploadedCount: number;
  aiGeneratedCount: number;
  totalCount: number;
}

interface TopSchool {
  schoolId: number;
  schoolName: string;
  lessonCount: number;
  userCount: number;
  hasActiveSubscription: boolean;
}

interface UserRegistration {
  period: string;
  totalRegistrations: number;
  schoolAdmins: number;
  contentModerators: number;
  teachers: number;
  students: number;
}

interface RevenueStats {
  period: string;
  creditPackRevenue: number;
  subscriptionRevenue: number;
  totalRevenue: number;
}

export interface DashboardResponse {
  systemOverview: {
    totalUsers: number;
    schoolAdmins: number;
    systemAdmins: number;
    contentModerators: number;
    teachers: number;
    students: number;
    totalLessons: number;
    uploadedLessons: number;
    aiGeneratedLessons: number;
    totalSchools: number;
    creditPackRevenue: number;
    subscriptionPlanRevenue: number;
    totalRevenue: number;
    totalStorageUsedBytes: number;
    totalStorageUsedGB: number;
  };
  lessonActivity: LessonActivity[];
  topSchools: TopSchool[];
  userRegistrations: UserRegistration[];
  revenueStats: RevenueStats[];
}
