type Status =
  | 0 // Active
  | 1 // Inactive
  | 2 // Deleted
  | 3; // Archived

export interface PricingPlan {
  description: string;
  id: string;
  maxUsers: number;
  name: string;
  priceMonthly: number;
  pricePerYear: number;
  status: Status;
  storageLimitGB: number;
}
