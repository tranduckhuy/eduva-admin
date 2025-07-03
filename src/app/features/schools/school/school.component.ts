import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SchoolService } from '../service/school.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [FormControlComponent, ButtonComponent, RouterLink],
  templateUrl: './school.component.html',
  styleUrl: './school.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly loadingService = inject(LoadingService);

  schoolId = input.required<string>();

  isLoading = this.loadingService;
  schoolDetail = this.schoolService.schoolDetail;

  ngOnInit(): void {
    this.schoolService.getSchoolDetailById(this.schoolId()).subscribe();
  }
}
