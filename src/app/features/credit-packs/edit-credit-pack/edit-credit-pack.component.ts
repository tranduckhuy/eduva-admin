import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { CreditPackCardComponent } from '../credit-pack-card/credit-pack-card.component';
import { CreditPackService } from '../service/credit-pack.service';
import { CreditPackRequest } from '../model/credit-pack-request.model';

@Component({
  selector: 'app-edit-credit-pack',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonComponent,
    CreditPackCardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-credit-pack.component.html',
  styleUrl: './edit-credit-pack.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCreditPackComponent {
  private readonly fb = inject(FormBuilder);
  private readonly creditPackService = inject(CreditPackService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  isLoading = this.loadingService.isLoading;
  creditPackDetail = this.creditPackService.creditPackDetail;
  originalData: CreditPackRequest | null = null; // Store original data

  constructor() {
    this.form = this.fb.group({
      name: [''],
      price: [0],
      credits: [0],
      bonusCredits: [0],
    });
  }

  form!: FormGroup;

  creditPackId = input.required<string>();

  submitted = signal<boolean>(false);

  ngOnInit(): void {
    this.creditPackService
      .getCreditPackDetailById(this.creditPackId())
      .subscribe(detail => {
        if (detail) {
          this.originalData = {
            name: detail.name,
            price: detail.price,
            credits: detail.credits,
            bonusCredits: detail.bonusCredits,
          };

          this.form.patchValue(this.originalData);
        }
      });
  }

  hasDataChanged(): boolean {
    if (!this.originalData) return true;

    const currentValues = this.form.value;
    return Object.keys(this.originalData).some(
      key =>
        this.originalData![key as keyof CreditPackRequest] !==
        currentValues[key]
    );
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.hasDataChanged()) {
      this.toastHandlingService.success(
        'Thành công',
        'Gói credit cập nhật thông tin thành công!'
      );
      return;
    }

    const req: CreditPackRequest = {
      name: this.form.value.name,
      price: this.form.value.price,
      credits: this.form.value.credits,
      bonusCredits: this.form.value.bonusCredits,
    };

    this.creditPackService.updateCredit(req, this.creditPackId()).subscribe();
  }
}
