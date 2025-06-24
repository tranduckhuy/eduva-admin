import { CurrencyPipe, registerLocaleData } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  LOCALE_ID,
} from '@angular/core';
import localeVi from '@angular/common/locales/vi';

import { ProgressBar } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';

interface StatCard {
  title: string;
  description: string;
  value: number;
  compareValue?: number;
  unit?: string;
  isRevenue?: boolean;
  icon: string;
  iconColor: string;
  subItems?: SubItem[];
}

interface SubItem {
  title: string;
  value: number;
}

registerLocaleData(localeVi);

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [ProgressBar, TooltipModule, CurrencyPipe],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'vi-VN' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  statCard = input.required<StatCard>();

  getPercent(value: number) {
    return Math.round((value / this.statCard().value) * 100);
  }
}
