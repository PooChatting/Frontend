import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  textInputHeight: string = "56"
  textareaValue: string = ""
  @Output() sendMessage = new EventEmitter<string>();

  messageChange(event: Event){
    let textArea = event.target as HTMLTextAreaElement
    textArea.style.height = "40px"
    textArea.style.height = textArea.scrollHeight + "px"
    this.textInputHeight = (textArea.scrollHeight + 16).toString()
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(!event.shiftKey && event.key == "Enter"){
      this.sendMessage.emit(this.textareaValue)
      this.textareaValue = ""
      event.preventDefault();
    }
  }
}
