import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { LeadingZeroPipe } from '../../../shared/pipes/leading-zero.pipe';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [
    SearchInputComponent,
    TableModule,
    InputTextModule,
    CommonModule,
    LeadingZeroPipe,
    TooltipModule,
    FormsModule,
    ButtonComponent,
  ],
  templateUrl: './system-config.component.html',
  styleUrl: './system-config.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemConfigComponent {
  items = signal<any>([
    { id: 1, code: 'C001', name: 'Item One', value: 'Value 1' },
    { id: 2, code: 'C002', name: 'Item Two', value: 'Value 2' },
    { id: 3, code: 'C003', name: 'Item Three', value: 'Value 3' },
    { id: 4, code: 'C004', name: 'Item Four', value: 'Value 4' },
    { id: 5, code: 'C005', name: 'Item Five', value: 'Value 5' },
    { id: 6, code: 'C006', name: 'Item Six', value: 'Value 6' },
    { id: 7, code: 'C007', name: 'Item Seven', value: 'Value 7' },
    { id: 8, code: 'C008', name: 'Item Eight', value: 'Value 8' },
    { id: 9, code: 'C009', name: 'Item Nine', value: 'Value 9' },
    { id: 10, code: 'C010', name: 'Item Ten', value: 'Value 10' },
  ]);

  onSearchTriggered(term: string) {}

  onEditComplete(event: any) {
    // event.data: the row data
    // event.field: the field that was edited
    // event.newValue: the new value entered
  }
}
