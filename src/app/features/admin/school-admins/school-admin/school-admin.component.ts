import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';

const schoolAdmin = {
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
};

@Component({
  selector: 'app-school-admin',
  standalone: true,
  imports: [FormControlComponent, FormsModule, ButtonComponent, RouterLink],
  templateUrl: './school-admin.component.html',
  styleUrl: './school-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolAdminComponent {
  schoolAdminId = input.required<string>();

  name = signal<string>('');
  address = signal<string>('');
  contactEmail = signal<string>('');
  phoneNumber = signal<string>('');
  imageUrl = signal<string>('');
  status = signal<string>('');
  createdAt = signal<string>('');
  lastModifiedAt = signal<string>('');
}
