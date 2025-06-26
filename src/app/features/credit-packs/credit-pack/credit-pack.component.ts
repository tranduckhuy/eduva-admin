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
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { CreditPackCardComponent } from '../credit-pack-card/credit-pack-card.component';
import { CreditPackService } from '../service/credit-pack.service';

@Component({
  selector: 'app-credit-pack',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonComponent,
    CreditPackCardComponent,
    RouterLink,
  ],
  templateUrl: './credit-pack.component.html',
  styleUrl: './credit-pack.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPackComponent {
  private readonly creditPackService = inject(CreditPackService);
  private readonly loadingService = inject(LoadingService);

  isLoading = this.loadingService;
  creditPackDetail = this.creditPackService.creditPackDetail;

  creditPackId = input.required<string>();

  ngOnInit(): void {
    this.creditPackService
      .getCreditPackDetailById(this.creditPackId())
      .subscribe();
  }
}
