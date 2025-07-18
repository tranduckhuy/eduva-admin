import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ThemeService } from '../../../shared/services/core/theme/theme.service';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  template: `
    <router-outlet />

    <p-toast />
    <p-confirmDialog [baseZIndex]="1000" />

    <button
      class="fixed right-5 top-5 z-10 transition-colors duration-100 ease-linear hover:text-primary md:right-[25px] md:top-[25px]"
      (click)="toggleDarkMode()">
      <i class="material-symbols-outlined !text-xl md:!text-[22px]">
        {{ isDarkMode() ? 'light_mode' : 'dark_mode' }}
      </i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlankLayoutComponent {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  private readonly currentUrl = signal(this.router.url);

  constructor() {
    effect(
      () => {
        this.currentUrl.set(this.router.url);
      },
      { allowSignalWrites: true }
    );
  }

  readonly isDarkMode = computed(() => this.themeService.isDarkMode());

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
