import { School } from '../../../features/schools/model/school-model';
import { Status } from '../common/entity-status';

type UserRole =
  | 'SystemAdmin'
  | 'SchoolAdmin'
  | 'ContentModerator'
  | 'Teacher'
  | 'Student';

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  status: Status;
  avatarUrl: string;
  school: School;
  roles: UserRole[];
  creditBalance: number;
}
