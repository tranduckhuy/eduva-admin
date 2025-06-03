import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BreadcrumbsDirective } from '../../../shared/directives/breadcrumbs/breadcrumbs.directive';

import { LayoutHeadingService } from '../layout-heading/services/layout-heading.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LayoutHeadingComponent } from '../layout-heading/layout-heading.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    BreadcrumbsDirective,
    HeaderComponent,
    NavbarComponent,
    LayoutHeadingComponent,
  ],
  template: `
    <div
      class="fixed inset-0 flex min-h-screen"
      [ngClass]="isSidebarOpen() ? 'sidebar-open' : ''">
      <!-- Navbar -->
      <div class="navbar">
        <app-navbar (closeSidebar)="toggleSidebar()" />
      </div>

      <!-- Main Content -->
      <div class="main-content px-6">
        <app-header (toggleSidebar)="toggleSidebar()" />

        <main appBreadcrumbs>
          <app-layout-heading [heading]="heading()" />

          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrl: './main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  private readonly layoutHeadingService = inject(LayoutHeadingService);
  heading = this.layoutHeadingService.heading;

  isSidebarOpen = signal<boolean>(false);

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}
