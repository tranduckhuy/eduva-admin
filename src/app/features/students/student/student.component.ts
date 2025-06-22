import {
  ChangeDetectionStrategy,
  Component,
  input,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import localeVi from '@angular/common/locales/vi';
import { DatePipe, registerLocaleData } from '@angular/common';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';

import { Student } from '../../../shared/models/entities/student.model';

registerLocaleData(localeVi);

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [FormControlComponent, FormsModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'vi' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentComponent {
  student: Student = {
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
  };

  studentId = input.required<string>();

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

  constructor(private readonly datePipe: DatePipe) {}

  formatDateVi(date: Date | string): string {
    return this.datePipe.transform(date, 'medium', undefined, 'vi') ?? '';
  }

  ngOnInit(): void {
    this.name.set(this.student.name);
    this.username.set(this.student.username);
    this.email.set(this.student.email);
    this.student.dob && this.dob.set(this.student.dob);
    this.phoneNumber.set(this.student.phoneNumber);
    this.avatarUrl.set(this.student.avatarUrl);
    this.status.set(
      this.student.status === 'active' ? 'Đang hoạt động' : 'Vô hiệu hóa'
    );
    this.createdAt.set(this.formatDateVi(new Date(this.student.createdAt!)));
    this.lastModifiedAt.set(
      this.formatDateVi(new Date(this.student.lastModifiedAt!))
    );
  }
}
