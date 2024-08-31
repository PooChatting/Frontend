import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  textInputHeight: string = "56"

  messageChange(event: Event){
    let textArea = event.target as HTMLTextAreaElement
    textArea.style.height = "40px"
    textArea.style.height = textArea.scrollHeight + "px"
    this.textInputHeight = (textArea.scrollHeight + 16).toString()
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(!event.shiftKey && event.key == "Enter"){
      console.log("send");
      
    }
  }
}
