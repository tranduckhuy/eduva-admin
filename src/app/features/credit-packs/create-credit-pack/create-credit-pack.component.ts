import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { CreditPackService } from '../service/credit-pack.service';
import { CreditPackRequest } from '../model/credit-pack-request.model';
import { CreditPackCardComponent } from '../credit-pack-card/credit-pack-card.component';

@Component({
  selector: 'app-create-credit-pack',
  standalone: true,
  imports: [
    FormControlComponent,
    ReactiveFormsModule,
    ButtonComponent,
    CreditPackCardComponent,
  ],
  templateUrl: './create-credit-pack.component.html',
  styleUrl: './create-credit-pack.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCreditPackComponent {
  private readonly fb = inject(FormBuilder);
  private readonly creditPackService = inject(CreditPackService);
  private readonly loadingService = inject(LoadingService);

  isLoading = this.loadingService;

  form!: FormGroup;

  submitted = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      name: [''],
      price: [0],
      credits: [0],
      bonusCredits: [0],
    });
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const req: CreditPackRequest = {
      name: this.form.value.name,
      price: this.form.value.price,
      credits: this.form.value.credits,
      bonusCredits: this.form.value.bonusCredits,
    };

    this.creditPackService.createCreditPack(req).subscribe();
  }
}
