import { inject, Injectable, signal } from '@angular/core';

import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { environment } from '../../../../environments/environment';
import { DashboardResponse } from '../../../shared/models/api/response/query/dashboard-response.model';
import { catchError, EMPTY, map, Observable, finalize } from 'rxjs';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { BaseResponse } from '../../../shared/models/api/base-response.model';
import { DashboardRequest } from '../../../shared/models/api/request/command/dashboard-request.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly requestService = inject(RequestService);
  private readonly toastService = inject(ToastHandlingService);
  private readonly loadingService = inject(LoadingService);

  // API URLs
  private readonly BASE_URL = `${environment.baseApiUrl}/dashboards/system-admin`;

  // Signals
  private readonly dashboardSignal = signal<DashboardResponse | null>(null);

  // Readonly signals
  readonly dashboardData = this.dashboardSignal.asReadonly();

  /**
   * Fetches dashboard data
   * @returns Observable with DashboardResponse or null
   */
  getDashboardData(
    req: DashboardRequest
  ): Observable<DashboardResponse | null> {
    this.loadingService.start('dashboard');

    return this.handleRequest<DashboardResponse>(
      this.requestService.get<DashboardResponse>(this.BASE_URL, req),
      {
        successHandler: data => this.dashboardSignal.set(data),
      }
    ).pipe(finalize(() => this.loadingService.stop('dashboard')));
  }

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
}
