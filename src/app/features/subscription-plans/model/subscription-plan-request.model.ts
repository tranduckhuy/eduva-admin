export interface SubscriptionPlanRequest {
  description: string;
  maxUsers: number;
  name: string;
  priceMonthly: number;
  pricePerYear: number;
  storageLimitGB: number;
}
