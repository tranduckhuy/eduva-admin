import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { debounceSignal } from '../../utils/util-functions';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly destroyDebounce: () => void;

  placeholder = input<string>('Tìm kiếm...');
  initialSearchTerm = input<string>('');
  customClasses = input<string>('');
  search = output<string>();

  searchTerm = signal<string>('');

  ngOnInit() {
    // this.searchTerm.set(this.initialSearchTerm());
  }

  // onSearch(): void {
  //   this.search.emit(this.searchTerm());
  // }

  constructor() {
    this.destroyDebounce = debounceSignal(
      this.searchTerm,
      value => {
        this.search.emit(value);
      },
      300
    );

    this.destroyRef.onDestroy(() => this.destroyDebounce());
  }
}
