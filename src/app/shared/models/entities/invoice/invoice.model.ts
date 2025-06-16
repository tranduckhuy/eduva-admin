export interface Invoice {
  id: number;
  client: {
    id: number;
    name: string;
    avatarUrl: string;
    email: string;
    phoneNumber: string;
  };
  school: {
    id: string;
    name: string;
  };
  amount: number;
  pricingPlan: {
    id: string;
    name: string;
    description?: string;
    price: number;
    creditLimit: number;
    storageLimit: number;
    maxAccounts: number;
    billingCycle: 'monthly' | 'yearly';
  };
  status: 'paid' | 'unpaid' | 'overdue';
  startDate?: Date;
  endDate?: Date;
}
