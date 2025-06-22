import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipModule } from 'primeng/tooltip';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';

import { SchoolAdmin } from '../../shared/models/entities/school-admin.model';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

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
    TooltipModule,
    DialogComponent,
  ],
  templateUrl: './school-admins.component.html',
  styleUrl: './school-admins.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolAdminsComponent implements OnInit {
  schoolAdmins: SchoolAdmin[] = [
    {
      id: 1,
      username: 'nguyenvanan',
      name: 'Nguyễn Văn An',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      dob: '1985-03-15',
      email: 'an.nguyen@example.com',
      phoneNumber: '0901234561',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH001',
      status: 'active',
      createdAt: new Date('2022-01-10T08:30:00'),
      lastModifiedAt: new Date('2023-04-12T10:20:00'),
    },
    {
      id: 2,
      username: 'tranthibinh',
      name: 'Trần Thị Bình',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      dob: '1990-07-22',
      email: 'binh.tran@example.com',
      phoneNumber: '0901234562',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH002',
      status: 'active',
      createdAt: new Date('2021-12-05T09:15:00'),
      lastModifiedAt: new Date('2023-01-30T11:10:00'),
    },
    {
      id: 3,
      username: 'levancuong',
      name: 'Lê Văn Cường',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      dob: '1982-11-05',
      email: 'cuong.le@example.com',
      phoneNumber: '0901234563',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH003',
      status: 'inactive',
      createdAt: new Date('2020-06-20T14:00:00'),
      lastModifiedAt: new Date('2022-12-01T08:45:00'),
    },
    {
      id: 4,
      username: 'phamthidung',
      name: 'Phạm Thị Dung',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      dob: '1988-02-17',
      email: 'dung.pham@example.com',
      phoneNumber: '0901234564',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH001',
      status: 'active',
      createdAt: new Date('2022-03-15T10:25:00'),
      lastModifiedAt: new Date('2023-02-20T09:00:00'),
    },
    {
      id: 5,
      username: 'hoangvanem',
      name: 'Hoàng Văn Em',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      dob: '1995-09-30',
      email: 'em.hoang@example.com',
      phoneNumber: '0901234565',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH004',
      status: 'active',
      createdAt: new Date('2023-01-05T12:00:00'),
      lastModifiedAt: new Date('2023-05-01T15:10:00'),
    },
    {
      id: 6,
      username: 'vuthigiang',
      name: 'Vũ Thị Giang',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
      dob: '1987-12-12',
      email: 'giang.vu@example.com',
      phoneNumber: '0901234566',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH005',
      status: 'inactive',
      createdAt: new Date('2021-08-25T08:40:00'),
      lastModifiedAt: new Date('2022-11-15T10:30:00'),
    },
    {
      id: 7,
      username: 'dovanhung',
      name: 'Đỗ Văn Hùng',
      avatarUrl: 'https://i.pravatar.cc/150?img=7',
      dob: '1983-05-18',
      email: 'hung.do@example.com',
      phoneNumber: '0901234567',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH002',
      status: 'active',
      createdAt: new Date('2020-10-10T09:00:00'),
      lastModifiedAt: new Date('2023-03-22T11:50:00'),
    },
    {
      id: 8,
      username: 'buithihanh',
      name: 'Bùi Thị Hạnh',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
      dob: '1992-04-25',
      email: 'hanh.bui@example.com',
      phoneNumber: '0901234568',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH003',
      status: 'active',
      createdAt: new Date('2022-05-15T13:20:00'),
      lastModifiedAt: new Date('2023-04-10T14:40:00'),
    },
    {
      id: 9,
      username: 'phanvankhoa',
      name: 'Phan Văn Khoa',
      avatarUrl: 'https://i.pravatar.cc/150?img=9',
      dob: '1989-08-09',
      email: 'khoa.phan@example.com',
      phoneNumber: '0901234569',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH004',
      status: 'inactive',
      createdAt: new Date('2019-11-20T11:15:00'),
      lastModifiedAt: new Date('2021-07-30T12:25:00'),
    },
    {
      id: 10,
      username: 'truongthilan',
      name: 'Trương Thị Lan',
      avatarUrl: 'https://i.pravatar.cc/150?img=10',
      dob: '1991-01-14',
      email: 'lan.truong@example.com',
      phoneNumber: '0901234570',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH005',
      status: 'active',
      createdAt: new Date('2023-02-01T14:35:00'),
      lastModifiedAt: new Date('2023-06-05T16:00:00'),
    },
    {
      id: 11,
      username: 'lyvanminh',
      name: 'Lý Văn Minh',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      dob: '1986-06-21',
      email: 'minh.ly@example.com',
      phoneNumber: '0901234571',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH001',
      status: 'active',
      createdAt: new Date('2022-07-18T09:45:00'),
      lastModifiedAt: new Date('2023-03-28T10:55:00'),
    },
    {
      id: 12,
      username: 'ngonga',
      name: 'Ngô Thị Nga',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      dob: '1984-10-11',
      email: 'nga.ngo@example.com',
      phoneNumber: '0901234572',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH002',
      status: 'inactive',
      createdAt: new Date('2021-04-23T08:10:00'),
      lastModifiedAt: new Date('2022-09-17T09:20:00'),
    },
    {
      id: 13,
      username: 'dangvanphuc',
      name: 'Đặng Văn Phúc',
      avatarUrl: 'https://i.pravatar.cc/150?img=13',
      dob: '1993-03-29',
      email: 'phuc.dang@example.com',
      phoneNumber: '0901234573',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH003',
      status: 'active',
      createdAt: new Date('2022-11-30T10:00:00'),
      lastModifiedAt: new Date('2023-05-20T11:10:00'),
    },
    {
      id: 14,
      username: 'trinhthiquynh',
      name: 'Trịnh Thị Quỳnh',
      avatarUrl: 'https://i.pravatar.cc/150?img=14',
      dob: '1988-09-06',
      email: 'quynh.trinh@example.com',
      phoneNumber: '0901234574',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH004',
      status: 'active',
      createdAt: new Date('2023-03-10T12:45:00'),
      lastModifiedAt: new Date('2023-06-08T14:30:00'),
    },
    {
      id: 15,
      username: 'phungvanson',
      name: 'Phùng Văn Sơn',
      avatarUrl: 'https://i.pravatar.cc/150?img=15',
      dob: '1987-07-19',
      email: 'son.phung@example.com',
      phoneNumber: '0901234575',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH005',
      status: 'inactive',
      createdAt: new Date('2020-12-05T09:30:00'),
      lastModifiedAt: new Date('2022-10-12T10:40:00'),
    },
    {
      id: 16,
      username: 'vothithanh',
      name: 'Võ Thị Thanh',
      avatarUrl: 'https://i.pravatar.cc/150?img=16',
      dob: '1994-05-02',
      email: 'thanh.vo@example.com',
      phoneNumber: '0901234576',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH001',
      status: 'active',
      createdAt: new Date('2023-01-20T11:15:00'),
      lastModifiedAt: new Date('2023-04-22T12:25:00'),
    },
    {
      id: 17,
      username: 'caovanthuan',
      name: 'Cao Văn Tuấn',
      avatarUrl: 'https://i.pravatar.cc/150?img=17',
      dob: '1985-11-28',
      email: 'tuan.cao@example.com',
      phoneNumber: '0901234577',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH002',
      status: 'active',
      createdAt: new Date('2021-06-07T08:50:00'),
      lastModifiedAt: new Date('2023-02-14T09:55:00'),
    },
    {
      id: 18,
      username: 'dothiuyen',
      name: 'Đỗ Thị Uyên',
      avatarUrl: 'https://i.pravatar.cc/150?img=18',
      dob: '1990-08-03',
      email: 'uyen.do@example.com',
      phoneNumber: '0901234578',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH003',
      status: 'inactive',
      createdAt: new Date('2020-09-15T10:20:00'),
      lastModifiedAt: new Date('2022-11-30T11:30:00'),
    },
    {
      id: 19,
      username: 'lamvanvinh',
      name: 'Lâm Văn Vinh',
      avatarUrl: 'https://i.pravatar.cc/150?img=19',
      dob: '1989-12-26',
      email: 'vinh.lam@example.com',
      phoneNumber: '0901234579',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH004',
      status: 'active',
      createdAt: new Date('2022-04-12T13:00:00'),
      lastModifiedAt: new Date('2023-05-15T14:10:00'),
    },
    {
      id: 20,
      username: 'phanthiyen',
      name: 'Phan Thị Yến',
      avatarUrl: 'https://i.pravatar.cc/150?img=20',
      dob: '1991-10-08',
      email: 'yen.phan@example.com',
      phoneNumber: '0901234580',
      schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
      schoolId: 'SCH005',
      status: 'active',
      createdAt: new Date('2023-02-25T15:30:00'),
      lastModifiedAt: new Date('2023-06-10T16:40:00'),
    },
  ];

  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  first = signal<number>(0);
  rows = signal<number>(10);

  @ViewChild('unarchiveDialogRef') unarchiveDialogRef!: DialogComponent;

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

  openUnarchiveDialog() {
    this.unarchiveDialogRef.showDialog();
  }

  get pagedSchoolAdmins(): SchoolAdmin[] {
    return this.schoolAdmins.slice(this.first(), this.first() + this.rows());
  }
}
