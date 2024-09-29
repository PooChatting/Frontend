import { Component, Input } from '@angular/core';
import { MessageDto } from '../../shared/dtos/MessageDto';

@Component({
  selector: 'app-text-message',
  standalone: true,
  templateUrl: './text-message.component.html'
})
export class TextMessageComponent {
  @Input({ required: true }) messageDto!: MessageDto
}
