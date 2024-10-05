import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { IconButtonComponent } from "../icon-button/icon-button.component";
import { CommonModule } from '@angular/common';
import { TextInputComponent } from "../text-input/text-input.component";

@Component({
  selector: 'app-text-message',
  standalone: true,
  templateUrl: './text-message.component.html',
  imports: [IconButtonComponent, IconButtonComponent, CommonModule, TextInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextMessageComponent {
  @Input({ required: true }) messageDto!: MessageDto
  buttonsVisible: boolean = false
  isEditting: boolean = false

  editMessage(){
    this.isEditting = !this.isEditting
  }
}
