import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { filter, map, mergeMap } from 'rxjs';

import { TailwindIndicatorComponent } from './shared/components/tailwind-indicator/tailwind-indicator.component';
import { NetworkStateComponent } from './shared/components/network-state/network-state.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TailwindIndicatorComponent, NetworkStateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        const title = data['title']
          ? `${data['title']} | by EDUVA`
          : 'EDUVA - Học, Học Nữa, Học Mãi';

        this.titleService.setTitle(title);
      });
  }
}
