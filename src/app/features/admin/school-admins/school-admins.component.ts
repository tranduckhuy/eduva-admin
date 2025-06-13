import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { SchoolAdmin } from '../../../shared/models/school-admin/school-admin.model';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { LeadingZeroPipe } from '../../../shared/pipes/leading-zero.pipe';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-school-admins',
  standalone: true,
  imports: [
    SearchInputComponent,
    BadgeComponent,
    ButtonComponent,
    TableModule,
    LeadingZeroPipe,
    RouterLink,
  ],
  templateUrl: './school-admins.component.html',
  styleUrl: './school-admins.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolAdminsComponent implements OnInit {
  schoolAdmins: SchoolAdmin[] = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      DOB: '1985-03-15',
      email: 'an.nguyen@example.com',
      phoneNumber: '0901234561',
      schoolId: 'SCH001',
      status: 'active',
      createdAt: new Date('2022-01-10T08:30:00'),
      lastModifiedAt: new Date('2023-04-12T10:20:00'),
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      DOB: '1990-07-22',
      email: 'binh.tran@example.com',
      phoneNumber: '0901234562',
      schoolId: 'SCH002',
      status: 'active',
      createdAt: new Date('2021-12-05T09:15:00'),
      lastModifiedAt: new Date('2023-01-30T11:10:00'),
    },
    {
      id: 3,
      name: 'Lê Văn Cường',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      DOB: '1982-11-05',
      email: 'cuong.le@example.com',
      phoneNumber: '0901234563',
      schoolId: 'SCH003',
      status: 'inactive',
      createdAt: new Date('2020-06-20T14:00:00'),
      lastModifiedAt: new Date('2022-12-01T08:45:00'),
    },
    {
      id: 4,
      name: 'Phạm Thị Dung',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      DOB: '1988-02-17',
      email: 'dung.pham@example.com',
      phoneNumber: '0901234564',
      schoolId: 'SCH001',
      status: 'active',
      createdAt: new Date('2022-03-15T10:25:00'),
      lastModifiedAt: new Date('2023-02-20T09:00:00'),
    },
    {
      id: 5,
      name: 'Hoàng Văn Em',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      DOB: '1995-09-30',
      email: 'em.hoang@example.com',
      phoneNumber: '0901234565',
      schoolId: 'SCH004',
      status: 'active',
      createdAt: new Date('2023-01-05T12:00:00'),
      lastModifiedAt: new Date('2023-05-01T15:10:00'),
    },
    {
      id: 6,
      name: 'Vũ Thị Giang',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
      DOB: '1987-12-12',
      email: 'giang.vu@example.com',
      phoneNumber: '0901234566',
      schoolId: 'SCH005',
      status: 'inactive',
      createdAt: new Date('2021-08-25T08:40:00'),
      lastModifiedAt: new Date('2022-11-15T10:30:00'),
    },
    {
      id: 7,
      name: 'Đỗ Văn Hùng',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=7',
      DOB: '1983-05-18',
      email: 'hung.do@example.com',
      phoneNumber: '0901234567',
      schoolId: 'SCH002',
      status: 'active',
      createdAt: new Date('2020-10-10T09:00:00'),
      lastModifiedAt: new Date('2023-03-22T11:50:00'),
    },
    {
      id: 8,
      name: 'Bùi Thị Hạnh',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
      DOB: '1992-04-25',
      email: 'hanh.bui@example.com',
      phoneNumber: '0901234568',
      schoolId: 'SCH003',
      status: 'active',
      createdAt: new Date('2022-05-15T13:20:00'),
      lastModifiedAt: new Date('2023-04-10T14:40:00'),
    },
    {
      id: 9,
      name: 'Phan Văn Khoa',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=9',
      DOB: '1989-08-09',
      email: 'khoa.phan@example.com',
      phoneNumber: '0901234569',
      schoolId: 'SCH004',
      status: 'inactive',
      createdAt: new Date('2019-11-20T11:15:00'),
      lastModifiedAt: new Date('2021-07-30T12:25:00'),
    },
    {
      id: 10,
      name: 'Trương Thị Lan',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=10',
      DOB: '1991-01-14',
      email: 'lan.truong@example.com',
      phoneNumber: '0901234570',
      schoolId: 'SCH005',
      status: 'active',
      createdAt: new Date('2023-02-01T14:35:00'),
      lastModifiedAt: new Date('2023-06-05T16:00:00'),
    },
    {
      id: 11,
      name: 'Lý Văn Minh',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      DOB: '1986-06-21',
      email: 'minh.ly@example.com',
      phoneNumber: '0901234571',
      schoolId: 'SCH001',
      status: 'active',
      createdAt: new Date('2022-07-18T09:45:00'),
      lastModifiedAt: new Date('2023-03-28T10:55:00'),
    },
    {
      id: 12,
      name: 'Ngô Thị Nga',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      DOB: '1984-10-11',
      email: 'nga.ngo@example.com',
      phoneNumber: '0901234572',
      schoolId: 'SCH002',
      status: 'inactive',
      createdAt: new Date('2021-04-23T08:10:00'),
      lastModifiedAt: new Date('2022-09-17T09:20:00'),
    },
    {
      id: 13,
      name: 'Đặng Văn Phúc',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=13',
      DOB: '1993-03-29',
      email: 'phuc.dang@example.com',
      phoneNumber: '0901234573',
      schoolId: 'SCH003',
      status: 'active',
      createdAt: new Date('2022-11-30T10:00:00'),
      lastModifiedAt: new Date('2023-05-20T11:10:00'),
    },
    {
      id: 14,
      name: 'Trịnh Thị Quỳnh',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=14',
      DOB: '1988-09-06',
      email: 'quynh.trinh@example.com',
      phoneNumber: '0901234574',
      schoolId: 'SCH004',
      status: 'active',
      createdAt: new Date('2023-03-10T12:45:00'),
      lastModifiedAt: new Date('2023-06-08T14:30:00'),
    },
    {
      id: 15,
      name: 'Phùng Văn Sơn',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=15',
      DOB: '1987-07-19',
      email: 'son.phung@example.com',
      phoneNumber: '0901234575',
      schoolId: 'SCH005',
      status: 'inactive',
      createdAt: new Date('2020-12-05T09:30:00'),
      lastModifiedAt: new Date('2022-10-12T10:40:00'),
    },
    {
      id: 16,
      name: 'Võ Thị Thanh',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=16',
      DOB: '1994-05-02',
      email: 'thanh.vo@example.com',
      phoneNumber: '0901234576',
      schoolId: 'SCH001',
      status: 'active',
      createdAt: new Date('2023-01-20T11:15:00'),
      lastModifiedAt: new Date('2023-04-22T12:25:00'),
    },
    {
      id: 17,
      name: 'Cao Văn Tuấn',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=17',
      DOB: '1985-11-28',
      email: 'tuan.cao@example.com',
      phoneNumber: '0901234577',
      schoolId: 'SCH002',
      status: 'active',
      createdAt: new Date('2021-06-07T08:50:00'),
      lastModifiedAt: new Date('2023-02-14T09:55:00'),
    },
    {
      id: 18,
      name: 'Đỗ Thị Uyên',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=18',
      DOB: '1990-08-03',
      email: 'uyen.do@example.com',
      phoneNumber: '0901234578',
      schoolId: 'SCH003',
      status: 'inactive',
      createdAt: new Date('2020-09-15T10:20:00'),
      lastModifiedAt: new Date('2022-11-30T11:30:00'),
    },
    {
      id: 19,
      name: 'Lâm Văn Vinh',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=19',
      DOB: '1989-12-26',
      email: 'vinh.lam@example.com',
      phoneNumber: '0901234579',
      schoolId: 'SCH004',
      status: 'active',
      createdAt: new Date('2022-04-12T13:00:00'),
      lastModifiedAt: new Date('2023-05-15T14:10:00'),
    },
    {
      id: 20,
      name: 'Phan Thị Yến',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      avatarUrl: 'https://i.pravatar.cc/150?img=20',
      DOB: '1991-10-08',
      email: 'yen.phan@example.com',
      phoneNumber: '0901234580',
      schoolId: 'SCH005',
      status: 'active',
      createdAt: new Date('2023-02-25T15:30:00'),
      lastModifiedAt: new Date('2023-06-10T16:40:00'),
    },
  ];

  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  first = signal<number>(0);

  rows = signal<number>(0);

  ngOnInit(): void {
    this.totalRecords.set(this.schoolAdmins.length);
  }

  loadProductsLazy(event: TableLazyLoadEvent) {}

  onSearchTriggered(term: string) {}

  next() {
    this.first.set(this.first() + this.rows());
  }

  prev() {
    this.first.set(this.first() - this.rows());
  }

  reset() {
    this.first.set(0);
  }

  pageChange(event: any) {
    console.log(this.first());

    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  isLastPage(): boolean {
    return this.schoolAdmins
      ? this.first() + this.rows() >= this.schoolAdmins.length
      : true;
  }

  isFirstPage(): boolean {
    return this.schoolAdmins ? this.first() === 0 : true;
  }
}
