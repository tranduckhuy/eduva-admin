import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  Input,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [Dialog, ButtonModule, InputTextModule, AvatarModule, CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  title = input<string>('');
  desc = input<string>('');
  visible = signal<boolean>(false);
  customClass = input<string>('');

  showDialog() {
    this.visible.set(true);
  }

  hideDialog() {
    this.visible.set(false);
  }
}
