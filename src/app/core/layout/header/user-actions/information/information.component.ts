import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faGear,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';

@Component({
  selector: 'header-information',
  standalone: true,
  imports: [FontAwesomeModule, SubmenuDirective],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  isFullScreen = input(false);
  isDarkMode = input(false);

  clickOutside = output();
  toggleFullSCreen = output();
  toggleDarkMode = output();

  libIcon = inject(FaIconLibrary);

  constructor() {
    this.libIcon.addIcons(faCircleUser, faGear, faArrowRightFromBracket);
  }
}
