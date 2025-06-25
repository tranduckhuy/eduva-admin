import { Status } from '../../../shared/models/common/entity-status';

export interface School {
  id: number;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  websiteUrl?: string;
  status: Status;
}
