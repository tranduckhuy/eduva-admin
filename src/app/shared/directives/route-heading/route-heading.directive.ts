import { Directive, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LayoutHeadingService } from '../../../core/layout/layout-heading/services/layout-heading.service';

@Directive({
  selector: '[routeHeading]',
  standalone: true,
})
export class RouteHeadingDirective {
  private readonly layout = inject(LayoutHeadingService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const heading = this.route.snapshot.data['heading'];
    if (heading) {
      this.layout.setHeading(heading);
    }
  }
}
