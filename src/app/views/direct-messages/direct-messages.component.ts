import { Component, HostListener, inject, QueryList, ViewChildren } from '@angular/core';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { TextMessageComponent } from '../../components/text-message/text-message.component';
import { MessagesService } from '../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { PostMessageDto } from "../../shared/dtos/PostMessageDto";
import { messageTypeEnum } from '../../shared/enums/MessageTypeEnum';
import { PutMessageDto } from '../../shared/dtos/PutMessageDto';
import { BinaryMessageSearchById, BinaryMessageSearchOnScreen } from '../../shared/utility/BinaryMessageSearch';
import { IconButtonComponent } from "../../components/icon-button/icon-button.component";
import { MessageHandlerService } from '../../shared/utility/MessageHandlerService';
import { ChannelsPickComponent } from '../channels-pick/channels-pick.component';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [CommonModule, TextInputComponent, TextMessageComponent, IconButtonComponent, ChannelsPickComponent],
  templateUrl: './direct-messages.component.html',
})

export class DirectMessagesComponent {
  inputBarHeight: number = 32
  isAtBottomOfPage: boolean = true
  showMessagesToastr: number[] = []
  messages: MessageDto[] = []
  channelId: string = ""
  userId: number = 0
  circleBottomPositionAnim = "100px"
  newestMessageId: number = 0
  messagesPage: number = 1
  messagesMaxPage: number = 2
  wasLastAddedPageUp: boolean = true
  awaitForMessagesCallback: boolean = false
  inputReplyMessage: MessageDto | undefined;
  @ViewChildren('message') messageElements!: QueryList<TextMessageComponent>;

  private messageService = inject(MessagesService)
  private activatedRoute = inject(ActivatedRoute)
  private messageHandler = inject(MessageHandlerService)

  getMessages(){
    this.activatedRoute.paramMap.subscribe(params => {
    this.channelId = params.get('id')!
    this.messageService.getMessagesFromChannel(this.channelId, 50, this.messagesPage == -1 ? 1 : this.messagesPage)
      .pipe(
        tap(x => {
          if (this.messagesPage == -1) { // This checks if it was called first time
            this.messages = []
            this.messagesPage++
          }
          if (this.wasLastAddedPageUp) {
            this.messages.unshift(...x.items)
            if (this.messages.length > 100) {
              this.messages.splice(101, this.messages.length-100)
            }
          }
          else{
            this.messages = this.messages.concat(x.items)
            if (this.messages.length > 100) {
              this.messages.splice(0, this.messages.length-100)
            }
          }
          this.messagesMaxPage = x.totalPages
          this.awaitForMessagesCallback = false
          this.setNewestMessage()
        })
      ).subscribe()
    });
  }

  ngAfterViewInit() {
    this.messageElements.changes.subscribe(_ => this.onItemElementsChanged());
    if (this.messages.length != 0) {
      this.onItemElementsChanged()
    }

    this.messageHandler.messageServiceInitializer()

    // TEMPORARY FIX !!!
    setTimeout(() => {
        let savedMessages = this.messageService.getSavedMessages(this.channelId)
        
        if (savedMessages != null && savedMessages.length != 0) {
          this.messages = savedMessages
        }
    }, 1);
    
    setTimeout(() => {
      this.messagesPage = -1
      this.wasLastAddedPageUp = true
      this.getMessages()
    }, 500);
    
    this.messageHandler.messages$.subscribe((updatedMessages) => {
      this.messages = updatedMessages;
      this.setNewestMessage()
    });
  }


  onItemElementsChanged(){
    if (this.isAtBottomOfPage) {
      window.scrollTo(0,document.body.scrollHeight);
      this.isAtBottomOfPage = false
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (window.scrollY > 0) {
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) { // If at the bottom of page
        this.isAtBottomOfPage = true
        this.circleBottomPositionAnim = "-100px"
      }
      else{
        this.circleBottomPositionAnim = `${this.inputBarHeight+64}px`
        this.isAtBottomOfPage = false
        if (window.scrollY < document.body.scrollHeight * 0.15 && !this.awaitForMessagesCallback && this.messagesPage != this.messagesMaxPage) {
          this.awaitForMessagesCallback = true
          if (!this.wasLastAddedPageUp) {
            this.messagesPage += 1
          }
          this.messagesPage += 1
          this.wasLastAddedPageUp = true
          this.getMessages()
        }
        if (window.innerHeight + window.scrollY > document.body.scrollHeight * 0.85 && !this.awaitForMessagesCallback && this.messagesPage >= 2) {
          this.awaitForMessagesCallback = true
          this.messagesPage -= 1
          if (this.wasLastAddedPageUp) {
            this.messagesPage -= 1
          }
          this.wasLastAddedPageUp = false
          this.getMessages()
        }
      }
      this.messageHandler.setIsAtBottomOfPage(this.isAtBottomOfPage)
    }
  }
  @HostListener('document:keyup', ['$event'])
  onKeyUp (event: KeyboardEvent) {
    if (event.key == "PrintScreen") {

      let messages = this.messageElements.toArray()
      let curViewportOffset = window.scrollY + (window.innerHeight/2)

      let messageIndex = BinaryMessageSearchOnScreen(messages, curViewportOffset)

      let data: PostMessageDto = {channelId: this.channelId, messageText: "screenshot", messageTypeEnum: messageTypeEnum.Screenshot, replyToId: messages[messageIndex].messageDto.id}
      this.messageService.postMessage(data).pipe().subscribe()
    }
  }

  sendMessage(message: string){
    let data: PostMessageDto = {channelId: this.channelId, messageText: message, messageTypeEnum: messageTypeEnum.Text, replyToId: this.inputReplyMessage?.id}
    this.messageService.postMessage(data).pipe().subscribe()
    this.inputReplyMessage = undefined
  }

  deleteMessage(message: MessageDto){
    this.messageService.deleteMessage(message.id).pipe().subscribe()
  }

  editMessage(messageDto: MessageDto, editText: string){
    let message: PutMessageDto = {id: messageDto.id, UpdatedMessage: editText}
    this.messageService.putMessage(message).pipe().subscribe()
  }

  shareMessage(sharedMessageId: number){
    let data: PostMessageDto = {channelId: this.channelId, messageText: "share", messageTypeEnum: messageTypeEnum.Share, replyToId: sharedMessageId}
    this.messageService.postMessage(data).pipe().subscribe()
  }
  
  setNewestMessage(){
    if (this.messages.length > 0 && this.messages[this.messages.length-1].id > this.newestMessageId) {
      this.newestMessageId = this.messages[this.messages.length-1].id
      this.messageHandler.setMessages(this.messages, this.channelId, this.newestMessageId);
    }
  }

  takeToMessage(messageId: number){
    if (messageId == this.newestMessageId) {
      this.isAtBottomOfPage = true
    }
    if (this.messages.findIndex(x => x.id == messageId) == -1) {
      this.messageService.getMessagesNearId(this.channelId, messageId, 50, 10).pipe(tap(x => {
        if (x.page > this.messagesPage) {
          this.wasLastAddedPageUp = false
        }
        this.messages = x.items
        this.messagesMaxPage = x.totalPages
        this.messagesPage = x.page
        
        setTimeout(() => {
          let messages = this.messageElements.toArray()
          let messageIndex = BinaryMessageSearchById(messages, messageId)
          window.scrollTo(0, messages[messageIndex].getOffsetHeight() - (window.innerHeight/2));
          messages[messageIndex].showAnimation()
        }, 1);
      }
      )).subscribe()
    }
    else{
      let messages = this.messageElements.toArray()
      let messageIndex = BinaryMessageSearchById(messages, messageId)
      window.scrollTo(0, messages[messageIndex].getOffsetHeight() - (window.innerHeight/2));
      messages[messageIndex].showAnimation()
    }
  }
}
