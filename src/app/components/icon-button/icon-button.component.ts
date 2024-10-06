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
  @Output() clicked = new EventEmitter<boolean>();
}
