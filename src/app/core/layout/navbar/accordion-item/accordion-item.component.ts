import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';

type Item = {
  label: string;
  link: string;
  active?: boolean;
};

@Component({
  selector: 'navbar-accordion-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent {
  // ? Input
  label = input.required<string>();
  icon = input.required<string>();
  isSidebarCollapsed = input.required();
  type = input.required<'accordion' | 'link'>();
  link = input<string>('#!');
  submenuItems = input<Item[]>([]);
  isActive = input<boolean>(false);

  // ? State Management
  private _manuallyOpened = signal<boolean>(false);

  // Compute isOpen based on both manual state and active state
  isOpen = computed(() => {
    return this._manuallyOpened() || this.isActive();
  });

  toggleAccordion() {
    // Only toggle the manual state, don't affect the active state
    this._manuallyOpened.set(!this._manuallyOpened());
  }
}
