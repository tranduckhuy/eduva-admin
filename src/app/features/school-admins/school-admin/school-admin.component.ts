import {
  ChangeDetectionStrategy,
  Component,
  input,
  LOCALE_ID,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import localeVi from '@angular/common/locales/vi';
import { DatePipe, registerLocaleData } from '@angular/common';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

registerLocaleData(localeVi);
@Component({
  selector: 'app-school-admin',
  standalone: true,
  imports: [FormControlComponent, FormsModule, ButtonComponent, RouterLink],
  templateUrl: './school-admin.component.html',
  styleUrl: './school-admin.component.css',
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'vi' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolAdminComponent implements OnInit {
  schoolAdmin = {
    id: 1,
    name: 'Nguyễn Văn An',
    username: 'an.nguyen',
    schoolName: 'Trường Tiểu học Nguyễn Văn Trỗi',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    dob: '1985-03-15',
    email: 'an.nguyen@example.com',
    phoneNumber: '0901234561',
    schoolId: 'SCH001',
    status: 'active',
    createdAt: new Date('2022-01-10T08:30:00'),
    lastModifiedAt: new Date('2023-04-12T10:20:00'),
    schoolEmail: 'nvt@gmail.com',
    schoolPhone: '0123456789',
    schoolAddress: '123 Đường Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh',
  };

  schoolAdminId = input.required<string>();

  name = signal<string>('');
  dob = signal<string>('');
  username = signal<string>('');
  address = signal<string>('');
  email = signal<string>('');
  phoneNumber = signal<string>('');
  avatarUrl = signal<string>('');
  status = signal<string>('');
  createdAt = signal<string>('');
  lastModifiedAt = signal<string>('');
  schoolName = signal<string>('Trường Tiểu học Nguyễn Văn Trỗi');
  schoolEmail = signal<string>('nvt@gmail.com');
  schoolPhone = signal<string>('0123456789');
  schoolAddress = signal<string>(
    '123 Đường Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh'
  );

  constructor(private readonly datePipe: DatePipe) {}

  formatDateVi(date: Date | string): string {
    return this.datePipe.transform(date, 'medium', undefined, 'vi') ?? '';
  }

  ngOnInit(): void {
    this.name.set(this.schoolAdmin.name);
    this.username.set(this.schoolAdmin.username);
    this.email.set(this.schoolAdmin.email);
    this.dob.set(this.schoolAdmin.dob);
    this.phoneNumber.set(this.schoolAdmin.phoneNumber);
    this.avatarUrl.set(this.schoolAdmin.avatarUrl);
    this.status.set(
      this.schoolAdmin.status === 'active' ? 'Đang hoạt động' : 'Vô hiệu hóa'
    );
    this.createdAt.set(this.formatDateVi(new Date(this.schoolAdmin.createdAt)));
    this.lastModifiedAt.set(
      this.formatDateVi(new Date(this.schoolAdmin.lastModifiedAt))
    );
  }
}
