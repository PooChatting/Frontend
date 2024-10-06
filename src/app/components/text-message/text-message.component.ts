import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, EventEmitter, inject, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { IconButtonComponent } from "../icon-button/icon-button.component";
import { CommonModule, formatDate } from '@angular/common';
import { TextInputComponent } from "../text-input/text-input.component";
import { PutMessageDto } from '../../shared/dtos/PutMessageDto';
import { MessagesService } from '../../services/messages/messages.service';
import { tap } from 'rxjs';
import { AuthService } from '../../services/account/auth.service';
import { messageTypeEnum } from '../../shared/enums/MessageTypeEnum';

@Component({
  selector: 'app-text-message',
  standalone: true,
  templateUrl: './text-message.component.html',
  styleUrl: './text-message.component.scss',
  imports: [IconButtonComponent, IconButtonComponent, CommonModule, TextInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextMessageComponent {
  @Input({ required: true }) messageDto!: MessageDto
  @Output() deleteMe = new EventEmitter<boolean>();
  buttonsVisible: boolean = false
  isEditting: boolean = false
  isUserMessageAuthor: boolean = false

  messageDeletedType = messageTypeEnum.Deleted
  messageTextType = messageTypeEnum.Text
  
  private messageService = inject(MessagesService)
  private authService = inject(AuthService)
  private changeDetector = inject(ChangeDetectorRef)
  
  ngOnInit(){
    this.isUserMessageAuthor = this.messageDto.authorId == this.authService.getJwtData()?.id

    let dateList = this.messageDto.publication.toString().split("T")
    let messageDate = dateList[0] // message yyyy-MM-dd
    let messageTime = dateList[1].split(":")[0] + ":" + dateList[1].split(":")[1] // message HH:mm
    let today = formatDate(new Date(), "yyyy-MM-dd", "en-US") // today yyy-MM-dd

    let dateCheck = new Date(today);
    let dateFromMessage = new Date(messageDate);
    
    if(dateCheck.toDateString() === dateFromMessage.toDateString()){
      this.messageDto.publication = `Today ${messageTime}`
      return
    }
    dateCheck.setDate(dateCheck.getDate() - 1)
    if(dateCheck.toDateString() === dateFromMessage.toDateString()){
      this.messageDto.publication = `Yesterday ${messageTime}`
      return
    }
    for (let x = 0; x < 5; x++) {
      dateCheck.setDate(dateCheck.getDate() - 1)
      if(dateCheck.toDateString() === dateFromMessage.toDateString()){
        this.messageDto.publication = `${dateCheck.toLocaleDateString("en-US", { weekday: 'long' })} ${messageTime}`
        return
      }
    }
    this.messageDto.publication = `${messageDate} ${messageTime}`
  }

  editMessage(){
    this.isEditting = !this.isEditting
  }

  MessageEditted(text: string){
    this.isEditting = false 
    let message: PutMessageDto = {id: this.messageDto.id, UpdatedMessage: text}
    this.messageService.putMessage(message).pipe(
      tap(x=> {
        if(x.status == 200){
          this.messageDto.messageText = text;
          this.messageDto.wasEdited = true;
          this.changeDetector.detectChanges();
        }
      })
    ).subscribe()
  }

  deleteMessage(){
    this.messageService.deleteMessage(this.messageDto.id).pipe(
      tap(x=> {
        if(x.status == 200){
          this.messageDto.messageText = "Has deleted message";
          this.messageDto.messageTypeEnum = messageTypeEnum.Deleted
          this.changeDetector.detectChanges();
        }
      })
    ).subscribe()
  }
}
