import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-heading',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './layout-heading.component.html',
  styleUrl: './layout-heading.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeadingComponent {
  heading = input.required<string>();

  private readonly router = inject(Router);

  showDate = computed(() => {
    const url = this.router.url;
    return url === '/' || url.startsWith('/dashboard');
  });

  currentDate = signal(
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  );
}
