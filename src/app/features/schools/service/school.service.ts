import { inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { EntityListResponse } from '../../../shared/models/api/response/query/entity-list-response.model';
import { School } from '../model/school-model';
import { SchoolDetail } from '../model/school-detail-model';
import { BaseResponse } from '../../../shared/models/api/base-response.model';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private readonly requestService = inject(RequestService);
  private readonly toastService = inject(ToastHandlingService);

  // API URLs
  private readonly BASE_URL = `${environment.baseApiUrl}/schools`;

  // Signals
  private readonly schoolsSignal = signal<School[]>([]);
  private readonly totalSchoolsSignal = signal<number>(0);
  private readonly schoolDetailSignal = signal<SchoolDetail | null>(null);

  // Readonly signals
  readonly schools = this.schoolsSignal.asReadonly();
  readonly totalSchools = this.totalSchoolsSignal.asReadonly();
  readonly schoolDetail = this.schoolDetailSignal.asReadonly();

  /**
   * Fetches a list of schools with pagination/sorting/filtering
   * @param params List parameters
   * @returns Observable with EntityListResponse or null
   */
  getSchools(
    params: EntityListParams
  ): Observable<EntityListResponse<School> | null> {
    return this.handleRequest<EntityListResponse<School>>(
      this.requestService.get<EntityListResponse<School>>(
        this.BASE_URL,
        params,
        {
          loadingKey: 'get-schools',
        }
      ),
      {
        successHandler: data => {
          this.schoolsSignal.set(data.data);
          this.totalSchoolsSignal.set(data.count);
        },
        errorHandler: () => this.resetSchools(),
      }
    );
  }

  /**
   * Fetches school details by ID
   * @param id School ID
   * @returns Observable with SchoolDetail data or null
   */
  getSchoolDetailById(id: string): Observable<SchoolDetail | null> {
    return this.handleRequest<SchoolDetail>(
      this.requestService.get<SchoolDetail>(`${this.BASE_URL}/${id}`),
      {
        successHandler: data => this.schoolDetailSignal.set(data),
        errorHandler: () => this.resetSchool(),
      }
    );
  }

  /**
   * Activates a school
   * @param id School ID to activate
   * @returns Observable<void>
   */
  activateSchool(id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}/activate`, '', {
        loadingKey: 'activate-school',
      }),
      'Kích hoạt trường học thành công!'
    );
  }

  /**
   * Archives a school
   * @param id School ID to archive
   * @returns Observable<void>
   */
  archiveSchool(id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}/archive`, '', {
        loadingKey: 'archive-school',
      }),
      'Vô hiệu hóa trường học thành công!'
    );
  }

  // Private helper methods

  /**
   * Handles common request patterns with success/error handling
   */
  private handleRequest<T>(
    request$: Observable<BaseResponse<T>>,
    options: {
      successHandler?: (data: T) => void;
      errorHandler?: () => void;
    } = {}
  ): Observable<T | null> {
    return request$.pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS && res.data !== undefined) {
          options.successHandler?.(res.data);
          return res.data;
        }
        options.errorHandler?.();
        this.toastService.errorGeneral();
        return null;
      }),
      catchError(() => {
        this.toastService.errorGeneral();
        return EMPTY;
      })
    );
  }

  /**
   * Handles modification requests (activate/archive) with common patterns
   */
  private handleModificationRequest(
    request$: Observable<BaseResponse<void>>,
    successMessage: string
  ): Observable<void> {
    return request$.pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS) {
          this.toastService.success('Thành công', successMessage);
        } else {
          this.toastService.errorGeneral();
        }
      }),
      catchError(() => {
        this.toastService.errorGeneral();
        return EMPTY;
      })
    );
  }

  private resetSchools(): void {
    this.schoolsSignal.set([]);
    this.totalSchoolsSignal.set(0);
  }

  private resetSchool(): void {
    this.schoolDetailSignal.set(null);
  }
}
