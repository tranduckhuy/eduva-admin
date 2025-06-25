import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SchoolService } from '../service/school.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [
    FormControlComponent,
    ReactiveFormsModule,
    ButtonComponent,
    RouterLink,
  ],
  templateUrl: './school.component.html',
  styleUrl: './school.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly schoolService = inject(SchoolService);
  private readonly loadingService = inject(LoadingService);

  schoolId = input.required<string>();

  isLoading = this.loadingService;
  schoolDetail = this.schoolService.schoolDetail;

  constructor() {
    this.form = this.fb.group({
      name: [''],
      contactEmail: [''],
      contactPhone: [''],
      address: [''],
      websiteUrl: [''],
      status: [0],
      schoolAdminId: [''],
      schoolAdminFullName: [''],
      schoolAdminEmail: [''],
    });
  }

  form!: FormGroup;

  ngOnInit(): void {
    this.schoolService
      .getSchoolDetailById(this.schoolId())
      .subscribe(detail => {
        if (detail) {
          this.form.patchValue({
            name: detail.name,
            contactEmail: detail.contactEmail,
            contactPhone: detail.contactPhone,
            address: detail.address,
            websiteUrl: detail.websiteUrl,
            status: detail.status === 0 ? 'Đang hoạt động' : 'Vô hiệu hóa',
            schoolAdminId: detail.schoolAdminId,
            schoolAdminFullName: detail.schoolAdminFullName,
            schoolAdminEmail: detail.schoolAdminEmail,
          });
        }
      });
  }
}
