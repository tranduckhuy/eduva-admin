import { Status } from '../../../shared/models/common/entity-status';

export interface SchoolDetail {
  id: number;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  websiteUrl?: string;
  status: Status;
  schoolAdminId: string;
  schoolAdminFullName: string;
  schoolAdminEmail: string;
}
