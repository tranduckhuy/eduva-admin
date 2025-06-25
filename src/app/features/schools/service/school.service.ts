import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { School } from '../model/school-model';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { EntityListResponse } from '../../../shared/models/api/response/entity-list-respone.model';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);
  private readonly router = inject(Router);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly SCHOOLS_API_URL = `${this.BASE_API_URL}/schools`;

  private readonly schoolsSignal = signal<School[]>([]);
  schools = this.schoolsSignal.asReadonly();

  private readonly totalSchoolsSignal = signal<number>(0);
  totalSchools = this.totalSchoolsSignal.asReadonly();

  private readonly schoolDetailSignal = signal<School | null>(null);
  schoolDetail = this.schoolDetailSignal.asReadonly();

  getSchools(
    params: EntityListParams
  ): Observable<EntityListResponse<School> | null> {
    return this.requestService
      .get<EntityListResponse<School> | null>(this.SCHOOLS_API_URL, params, {
        loadingKey: 'get-Schools',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            const { data, count } = res.data;
            this.schoolsSignal.set(data);
            this.totalSchoolsSignal.set(count);
            return res.data;
          } else {
            this.resetSchools();
            this.toastHandlingService.errorGeneral();
            return null;
          }
        }),
        catchError(() => of(null))
      );
  }

  activateSchool(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.SCHOOLS_API_URL}/${id}/activate`, '', {
        loadingKey: 'activate-school',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Kích hoạt trường học thành công!'
            );
            return;
          } else {
            this.toastHandlingService.errorGeneral();
            return;
          }
        }),
        catchError(() => of(void 0))
      );
  }
  archiveSchool(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.SCHOOLS_API_URL}/${id}/archive`, '', {
        loadingKey: 'archive-school',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Vô hiệu hóa trường học thành công!'
            );
            return;
          } else {
            this.toastHandlingService.errorGeneral();
            return;
          }
        }),
        catchError(() => of(void 0))
      );
  }

  private resetSchools(): void {
    this.schoolsSignal.set([]);
    this.totalSchoolsSignal.set(0);
  }
}
