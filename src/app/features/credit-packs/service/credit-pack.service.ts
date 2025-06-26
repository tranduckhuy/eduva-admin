import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, Observable, catchError, of, EMPTY } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { CreditPack } from '../model/credit-pack.model';
import { CreditPackRequest } from '../model/credit-pack-request.model';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { EntityListParams } from '../../../shared/models/common/entity-list-params';
import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { EntityListResponse } from '../../../shared/models/api/response/entity-list-response.model';

@Injectable({
  providedIn: 'root',
})
export class CreditPackService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);
  private readonly router = inject(Router);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly CREDIT_PACKS_API_URL = `${this.BASE_API_URL}/credit-packs`;

  private readonly creditPacksSignal = signal<CreditPack[]>([]);
  creditPacks = this.creditPacksSignal.asReadonly();

  private readonly totalCreditPackSignal = signal<number>(0);
  totalCreditPack = this.totalCreditPackSignal.asReadonly();

  private readonly creditPackDetailSignal = signal<CreditPack | null>(null);
  creditPackDetail = this.creditPackDetailSignal.asReadonly();

  getCreditPacks(
    params: EntityListParams
  ): Observable<EntityListResponse<CreditPack> | null> {
    return this.requestService
      .get<EntityListResponse<CreditPack> | null>(
        this.CREDIT_PACKS_API_URL,
        params,
        {
          loadingKey: 'get-credit-Packs',
        }
      )
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            const { data, count } = res.data;
            this.creditPacksSignal.set(data);
            this.totalCreditPackSignal.set(count);
            return res.data;
          } else {
            this.resetCreditPacks();
            this.toastHandlingService.errorGeneral();
            return null;
          }
        }),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
          return EMPTY;
        })
      );
  }

  getCreditPackDetailById(id: string): Observable<CreditPack | null> {
    return this.requestService
      .get<CreditPack | null>(`${this.CREDIT_PACKS_API_URL}/${id}`)
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            this.creditPackDetailSignal.set(res.data);
            return res.data;
          } else {
            this.resetCreditPackDetail();
            this.toastHandlingService.errorGeneral();
            return null;
          }
        }),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
          return EMPTY;
        })
      );
  }

  createCreditPack(req: CreditPackRequest): Observable<void> {
    return this.requestService.post<void>(this.CREDIT_PACKS_API_URL, req).pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS) {
          this.router.navigateByUrl('credit-packs');
          this.toastHandlingService.success(
            'Thành công',
            'Gói credit đã được tạo mới thành công!'
          );
        } else {
          this.toastHandlingService.errorGeneral();
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (
          err.error.statusCode &&
          StatusCode.PROVIDED_INFORMATION_IS_INVALID
        ) {
          this.toastHandlingService.error(
            'Thông tin cung cấp không hợp lệ',
            'Tên gói credit đã tồn tại. Vui lòng chọn tên khác!'
          );
        } else {
          this.toastHandlingService.errorGeneral();
        }
        return of(void 0);
      })
    );
  }

  updateCredit(req: CreditPackRequest, id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.CREDIT_PACKS_API_URL}/${id}`, req)
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Gói credit cập nhật thông tin thành công!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
        }),
        catchError((err: HttpErrorResponse) => {
          if (
            err.error.statusCode &&
            StatusCode.PROVIDED_INFORMATION_IS_INVALID
          ) {
            this.toastHandlingService.error(
              'Thông tin cung cấp không hợp lệ',
              'Tên gói credit đã tồn tại. Vui lòng chọn tên khác!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
          return of(void 0);
        })
      );
  }

  activateCreditPack(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.CREDIT_PACKS_API_URL}/${id}/activate`, '', {
        loadingKey: 'activate-pricing-plan',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Kích hoạt gói đăng ký thành công!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
        }),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
          return EMPTY;
        })
      );
  }

  archiveCreditPack(id: string): Observable<void> {
    return this.requestService
      .put<void>(`${this.CREDIT_PACKS_API_URL}/${id}/archive`, '', {
        loadingKey: 'archive-pricing-plan',
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS) {
            this.toastHandlingService.success(
              'Thành công',
              'Vô hiệu hóa gói đăng ký thành công!'
            );
          } else {
            this.toastHandlingService.errorGeneral();
          }
        }),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
          return EMPTY;
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
