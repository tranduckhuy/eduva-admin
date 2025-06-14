export interface SchoolAdmin {
  id: number;
  name: string;
  username: string;
  avatarUrl: string;
  dob?: string;
  email: string;
  phoneNumber: string;
  schoolId: string;
  schoolName: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  lastModifiedAt?: Date;
}
