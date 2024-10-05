import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  @ViewChild('inputDiv') inputDiv!: ElementRef;
  @Output() sendMessage = new EventEmitter<string>();
  @Output() inputHeight = new EventEmitter<number>();

  messageChange(element: HTMLDivElement){
    this.inputHeight.emit(parseInt(element.style.height.split("px")[0]))
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(!event.shiftKey && event.key == "Enter"){
      this.sendMessage.emit(this.inputDiv.nativeElement.innerHTML)
      this.inputDiv.nativeElement.innerHTML = ""
      this.inputHeight.emit(56)
      event.preventDefault();
    }
  }
}
