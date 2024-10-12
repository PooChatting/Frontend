import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { IconButtonComponent } from "../icon-button/icon-button.component";
import { CommonModule, formatDate } from '@angular/common';
import { TextInputComponent } from "../text-input/text-input.component";
import { MessagesService } from '../../services/messages/messages.service';
import { AuthService } from '../../services/account/auth.service';
import { messageTypeEnum } from '../../shared/enums/MessageTypeEnum';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ShareComponent } from '../share/share.component';
import { shareTypeEnum } from '../../shared/enums/ShareTypeEnum';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-text-message',
  standalone: true,
  templateUrl: './text-message.component.html',
  styleUrl: './text-message.component.scss',
  imports: [IconButtonComponent, IconButtonComponent, CommonModule, TextInputComponent, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextMessageComponent {
  @Input({ required: true }) messageDto!: MessageDto
  @Output() deleteMe = new EventEmitter<boolean>();
  @Output() sharedMessage = new EventEmitter<number>();
  @Output() deletedMessage = new EventEmitter<boolean>();
  @Output() replyMessage = new EventEmitter<boolean>();
  @Output() editedMessage = new EventEmitter<string>();
  @Output() clickOnRepliedMessage = new EventEmitter<number>();
  @ViewChild("messageElement") messageElement!: ElementRef<HTMLDivElement>;
  buttonsVisible: boolean = false
  isEditting: boolean = false
  isUserMessageAuthor: boolean = false
  playShowAnimation: boolean = false

  messageDeletedType = messageTypeEnum.Deleted
  messageTextType = messageTypeEnum.Text
  
  private authService = inject(AuthService)
  private clipboard = inject(Clipboard)
  private CDF = inject(ChangeDetectorRef)
  dialog = inject(MatDialog);

  openShareDialog() {
    let dialogRef = this.dialog.open(ShareComponent);

    dialogRef.componentInstance.Share.subscribe(result => {
      this.sharedMessage.emit(this.messageDto.id)
      switch (result) {
        case shareTypeEnum.Twitter:
          window.open(`https://twitter.com/share?text=${this.messageDto.authorName}%20created%20this%20message:%20${this.messageDto.messageText}%20&url=${environment.appWebUrl}`, "_blank")
          break;
        case shareTypeEnum.Telegram:
          window.open(`https://t.me/share/url?url=${environment.appWebUrl}&text=__${this.messageDto.authorName}__ created this message: __${this.messageDto.messageText}__`);
          break;
        case shareTypeEnum.Email:
          window.open(`mailto:?subject=Amazing message system at ${environment.appWebUrl}&body=${this.messageDto.authorName} created this message: ${this.messageDto.messageText}`);
          break;
      
        default:
          break;
      }
    })
  }

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

  public getOffsetHeight(){
    return this.messageElement.nativeElement.offsetTop
  }
  public showAnimation(){
    this.playShowAnimation = true
    this.CDF.detectChanges()
    setTimeout(() => {
      this.playShowAnimation = false
    }, 1000);
  }

  editMessage(){
    this.isEditting = !this.isEditting
  }

  MessageEditted(text: string){
    this.isEditting = false 
    this.editedMessage.emit(text)
  }

  copyMessage(){
    this.clipboard.copy(this.messageDto.messageText)
  }
}
