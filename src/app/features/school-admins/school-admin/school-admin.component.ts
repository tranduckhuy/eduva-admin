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
import { UserService } from '../../../shared/services/api/user/user.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';

@Component({
  selector: 'app-school-admin',
  standalone: true,
  imports: [FormControlComponent, ButtonComponent, RouterLink],
  templateUrl: './school-admin.component.html',
  styleUrl: './school-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolAdminComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);

  schoolAdminId = input.required<string>();

  isLoading = this.loadingService;
  schoolAdminDetail = this.userService.userDetail;

  ngOnInit(): void {
    this.userService.getUserDetailById(this.schoolAdminId()).subscribe();
  }
}
