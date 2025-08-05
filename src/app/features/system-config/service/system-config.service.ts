import { inject, Injectable, signal } from '@angular/core';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { environment } from '../../../../environments/environment';
import { SystemConfig } from '../../../shared/models/entities/system-config.model';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { EntityListResponse } from '../../../shared/models/api/response/query/entity-list-response.model';
import { BaseResponse } from '../../../shared/models/api/base-response.model';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { UpdateSystemConfigRequest } from '../../../shared/models/api/request/command/update-system-config-request.model';

@Injectable({
  providedIn: 'root',
})
export class SystemConfigService {
  private readonly requestService = inject(RequestService);
  private readonly toastService = inject(ToastHandlingService);

  // API URLs
  private readonly BASE_URL = `${environment.baseApiUrl}/admin/system-configs`;

  // Signals
  private readonly systemConfigSignal = signal<SystemConfig[]>([]);

  // Readonly signals
  readonly systemConfig = this.systemConfigSignal.asReadonly();

  /**
   * Fetches all system configurations
   * @param params List parameters
   * @returns Observable with SystemConfig array or null
   */
  getSystemConfig(): Observable<SystemConfig[] | null> {
    return this.handleRequest<SystemConfig[]>(
      this.requestService.get<SystemConfig[]>(
        this.BASE_URL,
        {},
        {
          loadingKey: 'get-system-config',
        }
      ),
      {
        successHandler: data => {
          this.systemConfigSignal.set(data);
        },
        errorHandler: () => this.resetSystemConfig(),
      }
    );
  }

  /**
   * Updates a system configuration
   * @param config SystemConfig object to update
   * @returns Observable<void>
   */
  updateSystemConfig(
    key: string,
    req: UpdateSystemConfigRequest
  ): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${key}`, req, {
        loadingKey: 'update-system-config',
      }),
      'Cập nhật cấu hình hệ thống thành công!'
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
   * Handles modification requests (update) with common patterns
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

  private resetSystemConfig() {
    this.systemConfigSignal.set([]);
  }
}
