import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IconButtonComponent],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  @ViewChild('inputDiv') inputDiv!: ElementRef;
  @Input() showMediaBtns: boolean = true;
  @Input() replyMode: MessageDto | undefined;
  @Input() startText: string = "";
  @Output() sendMessage = new EventEmitter<string>();
  @Output() inputHeight = new EventEmitter<number>();
  @Output() removeReplyMode = new EventEmitter<undefined>();
  hasSentMessage: boolean = false

  ngAfterViewInit(){
    this.inputDiv.nativeElement.innerHTML = this.startText
  }

  messageChange(element: HTMLDivElement){
    this.inputHeight.emit(parseInt(element.style.height.split("px")[0]))
    this.hasSentMessage = false
  }

  ngOnChanges() {
    if (this.inputDiv != null) {
      this.inputDiv.nativeElement.innerHTML = this.startText
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!event.shiftKey && event.key == "Enter") {
      event.preventDefault();
      if (this.inputDiv.nativeElement.innerHTML != this.startText && !this.hasSentMessage) {
        this.hasSentMessage = true
        this.sendMessage.emit(this.inputDiv.nativeElement.innerText)
        this.inputDiv.nativeElement.innerHTML = ""
        this.inputHeight.emit(56)
      }
    }
  }
}
