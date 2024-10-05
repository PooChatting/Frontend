import { Component, Input } from '@angular/core';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { IconButtonComponent } from "../icon-button/icon-button.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-message',
  standalone: true,
  templateUrl: './text-message.component.html',
  imports: [IconButtonComponent, IconButtonComponent, CommonModule]
})
export class TextMessageComponent {
  @Input({ required: true }) messageDto!: MessageDto
  buttonsVisible: boolean = false
}
