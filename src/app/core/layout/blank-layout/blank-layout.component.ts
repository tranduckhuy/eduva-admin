import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ConfirmDialog } from 'primeng/confirmdialog';

import { ThemeService } from '../../../shared/services/theme/theme.service';

import { GlobalModalHostComponent } from '../../../shared/components/global-modal-host/global-modal-host.component';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterOutlet, GlobalModalHostComponent, ConfirmDialog],
  template: `
    <p-confirmdialog [baseZIndex]="1000" />
    <app-global-modal-host />
    <button
      class="fixed right-5 top-5 z-10 transition-colors duration-100 ease-linear hover:text-primary md:right-[25px] md:top-[25px]"
      (click)="toggleDarkMode()">
      <i class="material-symbols-outlined !text-xl md:!text-[22px]">
        {{ isDarkMode() ? 'light_mode' : 'dark_mode' }}
      </i>
    </button>
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlankLayoutComponent {
  readonly themeService = inject(ThemeService);

  readonly isDarkMode = computed(() => this.themeService.isDarkMode());

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
