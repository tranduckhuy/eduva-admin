import { Directive, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';

import { MenuItem } from 'primeng/api';

import { BreadcrumbsService } from '../../services/breadcrumbs/breadcrumbs.service';

@Directive({
  selector: '[appBreadcrumbs]',
  standalone: true,
})
export class BreadcrumbsDirective {
  private readonly route = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbsService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs: MenuItem[] = [];

        let current = this.route.root;
        let url = '';

        while (current.firstChild) {
          current = current.firstChild;
          const snapshot = current.snapshot;

          if (snapshot.url.length > 0) {
            url += '/' + snapshot.url.map(s => s.path).join('/');

            const label = snapshot.data['breadcrumb'];
            const tooltip = snapshot.data['heading'];

            if (label) {
              breadcrumbs.push({
                label,
                tooltip,
                routerLink: url,
              });
            }
          }
        }

        this.breadcrumbService.setBreadcrumbs([
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/',
          },
          ...breadcrumbs,
        ]);
      });
  }
}
