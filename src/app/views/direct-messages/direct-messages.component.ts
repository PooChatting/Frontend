import { Component, HostListener } from '@angular/core';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { TextMessageComponent } from '../../components/text-message/text-message.component';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [CommonModule, TextInputComponent, TextMessageComponent],
  templateUrl: './direct-messages.component.html',
})
export class DirectMessagesComponent {
  messages: string[] = ["1", "2", "3","4","5","6"]
  
  // @HostListener('document:keyup', ['$event'])
  // onKeyUp (event: KeyboardEvent) {
  //   if (event.key == "PrintScreen") {
      
  //   }
  // }
}
