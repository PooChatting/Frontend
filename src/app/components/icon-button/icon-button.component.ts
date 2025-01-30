import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  @Input({required: true}) icon!: string;
  @Input() disabled?: boolean = false;
  @Input() round?: boolean = false;
  @Input() large?: boolean = false;
  @Output() clicked = new EventEmitter<boolean>();
}
