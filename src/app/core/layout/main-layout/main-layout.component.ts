import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { RouteMetadataDirective } from '../../../shared/directives/route-metadata/route-metadata.directive';

import { LayoutHeadingService } from '../../../shared/services/layout-heading/layout-heading.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LayoutHeadingComponent } from '../layout-heading/layout-heading.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouteMetadataDirective,
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

        <main routeMetadata>
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
