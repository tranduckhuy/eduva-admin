import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
  title = 'frontend-admin';
}
