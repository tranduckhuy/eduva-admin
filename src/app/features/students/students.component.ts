import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipModule } from 'primeng/tooltip';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

import { Student } from '../../shared/models/entities/student.model';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    SearchInputComponent,
    BadgeComponent,
    ButtonComponent,
    TableModule,
    LeadingZeroPipe,
    TooltipModule,
    RouterLink,
    DialogComponent,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsComponent {
  students: Student[] = [
    {
      id: 1,
      name: 'Phạm Văn A',
      username: 'pvana',
      avatarUrl: 'https://randomuser.me/api/portraits/men/21.jpg',
      dob: '2005-01-15',
      email: 'pvana@example.com',
      phoneNumber: '0901234567',
      schoolId: 'SCH001',
      schoolName: 'Trường THPT A',
      status: 'active',
      createdAt: new Date('2021-09-01'),
      lastModifiedAt: new Date('2023-05-01'),
    },
    {
      id: 2,
      name: 'Nguyễn Thị B',
      username: 'ntb',
      avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      dob: '2004-03-20',
      email: 'ntb@example.com',
      phoneNumber: '0912345678',
      schoolId: 'SCH002',
      schoolName: 'Trường THPT B',
      status: 'active',
      createdAt: new Date('2020-08-15'),
      lastModifiedAt: new Date('2023-04-20'),
    },
    {
      id: 3,
      name: 'Trần Văn C',
      username: 'tvc',
      avatarUrl: 'https://randomuser.me/api/portraits/men/23.jpg',
      dob: '2005-07-10',
      email: 'tvc@example.com',
      phoneNumber: '0987654321',
      schoolId: 'SCH003',
      schoolName: 'Trường THPT C',
      status: 'inactive',
      createdAt: new Date('2019-11-10'),
      lastModifiedAt: new Date('2022-12-25'),
    },
    {
      id: 4,
      name: 'Lê Thị D',
      username: 'ltd',
      avatarUrl: 'https://randomuser.me/api/portraits/women/24.jpg',
      dob: '2006-05-05',
      email: 'ltd@example.com',
      phoneNumber: '0909876543',
      schoolId: 'SCH001',
      schoolName: 'Trường THPT A',
      status: 'active',
      createdAt: new Date('2022-01-20'),
      lastModifiedAt: new Date('2023-02-15'),
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      username: 'hve',
      avatarUrl: 'https://randomuser.me/api/portraits/men/25.jpg',
      dob: '2004-12-12',
      email: 'hve@example.com',
      phoneNumber: '0911122233',
      schoolId: 'SCH002',
      schoolName: 'Trường THPT B',
      status: 'active',
      createdAt: new Date('2020-05-15'),
      lastModifiedAt: new Date('2023-03-10'),
    },
    {
      id: 6,
      name: 'Đặng Thị F',
      username: 'dtf',
      avatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
      dob: '2005-09-09',
      email: 'dtf@example.com',
      phoneNumber: '0933445566',
      schoolId: 'SCH003',
      schoolName: 'Trường THPT C',
      status: 'inactive',
      createdAt: new Date('2019-03-18'),
      lastModifiedAt: new Date('2022-10-20'),
    },
    {
      id: 7,
      name: 'Vũ Minh G',
      username: 'vmg',
      avatarUrl: 'https://randomuser.me/api/portraits/men/27.jpg',
      dob: '2006-11-11',
      email: 'vmg@example.com',
      phoneNumber: '0922334455',
      schoolId: 'SCH001',
      schoolName: 'Trường THPT A',
      status: 'active',
      createdAt: new Date('2021-06-25'),
      lastModifiedAt: new Date('2023-04-30'),
    },
    {
      id: 8,
      name: 'Lý Thị H',
      username: 'lth',
      avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
      dob: '2005-02-14',
      email: 'lth@example.com',
      phoneNumber: '0944556677',
      schoolId: 'SCH002',
      schoolName: 'Trường THPT B',
      status: 'active',
      createdAt: new Date('2020-10-10'),
      lastModifiedAt: new Date('2023-04-22'),
    },
    {
      id: 9,
      name: 'Trịnh Văn I',
      username: 'tvi',
      avatarUrl: 'https://randomuser.me/api/portraits/men/29.jpg',
      dob: '2004-08-08',
      email: 'tvi@example.com',
      phoneNumber: '0905566778',
      schoolId: 'SCH003',
      schoolName: 'Trường THPT C',
      status: 'inactive',
      createdAt: new Date('2018-12-12'),
      lastModifiedAt: new Date('2022-09-28'),
    },
    {
      id: 10,
      name: 'Phan Thị J',
      username: 'ptj',
      avatarUrl: 'https://randomuser.me/api/portraits/women/30.jpg',
      dob: '2006-07-07',
      email: 'ptj@example.com',
      phoneNumber: '0912233445',
      schoolId: 'SCH001',
      schoolName: 'Trường THPT A',
      status: 'active',
      createdAt: new Date('2021-03-03'),
      lastModifiedAt: new Date('2023-03-15'),
    },
    {
      id: 11,
      name: 'Ngô Văn K',
      username: 'nvk',
      avatarUrl: 'https://randomuser.me/api/portraits/men/31.jpg',
      dob: '2005-04-04',
      email: 'nvk@example.com',
      phoneNumber: '0933667788',
      schoolId: 'SCH002',
      schoolName: 'Trường THPT B',
      status: 'active',
      createdAt: new Date('2020-01-01'),
      lastModifiedAt: new Date('2023-02-02'),
    },
    {
      id: 12,
      name: 'Bùi Thị L',
      username: 'btl',
      avatarUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
      dob: '2004-06-06',
      email: 'btl@example.com',
      phoneNumber: '0922445566',
      schoolId: 'SCH003',
      schoolName: 'Trường THPT C',
      status: 'active',
      createdAt: new Date('2019-05-05'),
      lastModifiedAt: new Date('2023-04-04'),
    },
    {
      id: 13,
      name: 'Đỗ Văn M',
      username: 'dvm',
      avatarUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
      dob: '2005-10-10',
      email: 'dvm@example.com',
      phoneNumber: '0909988776',
      schoolId: 'SCH001',
      schoolName: 'Trường THPT A',
      status: 'inactive',
      createdAt: new Date('2018-11-11'),
      lastModifiedAt: new Date('2022-08-08'),
    },
    {
      id: 14,
      name: 'Phùng Thị N',
      username: 'ptn',
      avatarUrl: 'https://randomuser.me/api/portraits/women/34.jpg',
      dob: '2006-09-09',
      email: 'ptn@example.com',
      phoneNumber: '0911776655',
      schoolId: 'SCH002',
      schoolName: 'Trường THPT B',
      status: 'active',
      createdAt: new Date('2021-07-07'),
      lastModifiedAt: new Date('2023-01-01'),
    },
    {
      id: 15,
      name: 'Trần Văn O',
      username: 'tvo',
      avatarUrl: 'https://randomuser.me/api/portraits/men/35.jpg',
      dob: '2004-11-11',
      email: 'tvo@example.com',
      phoneNumber: '0933111222',
      schoolId: 'SCH003',
      schoolName: 'Trường THPT C',
      status: 'active',
      createdAt: new Date('2020-12-12'),
      lastModifiedAt: new Date('2023-05-05'),
    },
  ];

  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  first = signal<number>(0);
  rows = signal<number>(10);

  @ViewChild('unarchiveDialogRef') unarchiveDialogRef!: DialogComponent;

  ngOnInit(): void {
    this.totalRecords.set(this.students.length);
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
    return this.students
      ? this.first() + this.rows() >= this.students.length
      : true;
  }

  isFirstPage(): boolean {
    return this.students ? this.first() === 0 : true;
  }

  openUnarchiveDialog() {
    this.unarchiveDialogRef.showDialog();
  }

  get pagedStudents(): Student[] {
    return this.students.slice(this.first(), this.first() + this.rows());
  }
}
