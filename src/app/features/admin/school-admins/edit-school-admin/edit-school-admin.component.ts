import {
  ChangeDetectionStrategy,
  Component,
  input,
  LOCALE_ID,
  OnInit,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe, registerLocaleData, CommonModule } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

registerLocaleData(localeVi);

@Component({
  selector: 'app-edit-school-admin',
  standalone: true,
  imports: [FormControlComponent, FormsModule, ButtonComponent, CommonModule],
  templateUrl: './edit-school-admin.component.html',
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'vi' }],
  styleUrl: './edit-school-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSchoolAdminComponent implements OnInit {
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

  submitted = false;

  statusOptions = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Ngừng hoạt động', value: 'inactive' },
  ];

  selectedAvatarFile = signal<File | null>(null);
  selectedAvatarUrl = signal<string | null>(null);

  constructor(
    private readonly datePipe: DatePipe,
    private readonly cdr: ChangeDetectorRef
  ) {}

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
    this.status.set(this.schoolAdmin.status);
    this.createdAt.set(this.formatDateVi(new Date(this.schoolAdmin.createdAt)));
    this.lastModifiedAt.set(
      this.formatDateVi(new Date(this.schoolAdmin.lastModifiedAt))
    );
    this.selectedAvatarFile.set(null);
    this.selectedAvatarUrl.set(null);
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      this.selectedAvatarFile.set(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedAvatarUrl.set(e.target.result);
      };
      reader.readAsDataURL(file);
      input.value = '';
    }
  }

  removeSelectedAvatar() {
    this.selectedAvatarFile.set(null);
    this.selectedAvatarUrl.set(null);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }
    // Submit logic
    const avatarFile = this.selectedAvatarFile();
    if (avatarFile) {
      // Handle logic if an avatar file is selected
    }
  }
}
