import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, catchError, of, EMPTY } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { EntityListResponse } from '../../../shared/models/api/response/entity-list-response.model';
import { CreditPack } from '../model/credit-pack.model';
import { CreditPackRequest } from '../model/credit-pack-request.model';
import { BaseResponse } from '../../../shared/models/api/response/base-response.model';

@Injectable({ providedIn: 'root' })
export class CreditPackService {
  private readonly requestService = inject(RequestService);
  private readonly toastService = inject(ToastHandlingService);
  private readonly router = inject(Router);

  // API URLs
  private readonly BASE_URL = `${environment.baseApiUrl}/credit-packs`;

  // Signals
  private readonly creditPacksSignal = signal<CreditPack[]>([]);
  private readonly totalCreditPackSignal = signal<number>(0);
  private readonly creditPackDetailSignal = signal<CreditPack | null>(null);

  // Readonly signals
  readonly creditPacks = this.creditPacksSignal.asReadonly();
  readonly totalCreditPack = this.totalCreditPackSignal.asReadonly();
  readonly creditPackDetail = this.creditPackDetailSignal.asReadonly();

  /**
   * Fetches a list of credit packs
   * @param params List parameters
   * @returns Observable with EntityListResponse or null
   */
  getCreditPacks(
    params: EntityListParams
  ): Observable<EntityListResponse<CreditPack> | null> {
    return this.handleRequest<EntityListResponse<CreditPack>>(
      this.requestService.get<EntityListResponse<CreditPack>>(
        this.BASE_URL,
        params,
        {
          loadingKey: 'get-credit-packs',
        }
      ),
      {
        successHandler: data => {
          this.creditPacksSignal.set(data.data);
          this.totalCreditPackSignal.set(data.count);
        },
        errorHandler: () => this.resetCreditPacks(),
      }
    );
  }

  /**
   * Fetches credit pack details by ID
   * @param id Credit pack ID
   * @returns Observable with CreditPack or null
   */
  getCreditPackDetailById(id: string): Observable<CreditPack | null> {
    return this.handleRequest<CreditPack>(
      this.requestService.get<CreditPack>(`${this.BASE_URL}/${id}`),
      {
        successHandler: data => this.creditPackDetailSignal.set(data),
        errorHandler: () => this.resetCreditPackDetail(),
      }
    );
  }

  /**
   * Creates a new credit pack
   * @param req Credit pack request data
   * @returns Observable<void>
   */
  createCreditPack(req: CreditPackRequest): Observable<void> {
    return this.handleCreationRequest(
      this.requestService.post<void>(this.BASE_URL, req),
      'Gói credit đã được tạo mới thành công!',
      'credit-packs'
    );
  }

  /**
   * Updates an existing credit pack
   * @param req Credit pack request data
   * @param id Credit pack ID to update
   * @returns Observable<void>
   */
  updateCredit(req: CreditPackRequest, id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}`, req),
      'Gói credit cập nhật thông tin thành công!',
      true
    );
  }

  /**
   * Activates a credit pack
   * @param id Credit pack ID to activate
   * @returns Observable<void>
   */
  activateCreditPack(id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}/activate`, '', {
        loadingKey: 'activate-credit-pack',
      }),
      'Kích hoạt gói credit thành công!'
    );
  }

  /**
   * Archives a credit pack
   * @param id Credit pack ID to archive
   * @returns Observable<void>
   */
  archiveCreditPack(id: string): Observable<void> {
    return this.handleModificationRequest(
      this.requestService.put<void>(`${this.BASE_URL}/${id}/archive`, '', {
        loadingKey: 'archive-credit-pack',
      }),
      'Vô hiệu hóa gói credit thành công!'
    );
  }

  // Private helper methods

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

  private handleModificationRequest(
    request$: Observable<BaseResponse<void>>,
    successMessage: string,
    handleNameConflict: boolean = false
  ): Observable<void> {
    return request$.pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS) {
          this.toastService.success('Thành công', successMessage);
        } else {
          this.toastService.errorGeneral();
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (
          handleNameConflict &&
          err.error.statusCode === StatusCode.PROVIDED_INFORMATION_IS_INVALID
        ) {
          this.toastService.error(
            'Thông tin cung cấp không hợp lệ',
            'Tên gói credit đã tồn tại. Vui lòng chọn tên khác!'
          );
        } else {
          this.toastService.errorGeneral();
        }
        return of(void 0);
      })
    );
  }

  private handleCreationRequest(
    request$: Observable<BaseResponse<void>>,
    successMessage: string,
    redirectUrl: string
  ): Observable<void> {
    return request$.pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS) {
          this.router.navigateByUrl(redirectUrl);
          this.toastService.success('Thành công', successMessage);
        } else {
          this.toastService.errorGeneral();
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (
          err.error.statusCode === StatusCode.PROVIDED_INFORMATION_IS_INVALID
        ) {
          this.toastService.error(
            'Thông tin cung cấp không hợp lệ',
            'Tên gói credit đã tồn tại. Vui lòng chọn tên khác!'
          );
        } else {
          this.toastService.errorGeneral();
        }
        return of(void 0);
      })
    );
  }

  private resetCreditPacks(): void {
    this.creditPacksSignal.set([]);
    this.totalCreditPackSignal.set(0);
  }

  private resetCreditPackDetail(): void {
    this.creditPackDetailSignal.set(null);
  }
}
