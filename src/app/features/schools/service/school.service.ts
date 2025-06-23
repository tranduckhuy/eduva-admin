import { inject, Injectable, signal } from '@angular/core';

import { finalize, map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { StatusCode } from '../../../shared/constants/status-code.constant';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly GET_SCHOOLS_API_URL = `${this.BASE_API_URL}/schools`;

  private readonly isLoadingSignal = signal<boolean>(false);
  isLoading = this.isLoadingSignal.asReadonly();

  getSchools(): Observable<any> {
    this.isLoadingSignal.set(true);
    return this.requestService.get<any>(this.GET_SCHOOLS_API_URL).pipe(
      map(res => {
        if (res.statusCode === StatusCode.SUCCESS && res.data) {
          return true;
        } else {
          this.toastHandlingService.errorGeneral();
          return false;
        }
      }),
      finalize(() => {
        this.isLoadingSignal.set(false);
      })
    );
  }
}
