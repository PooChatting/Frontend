import { Component, HostListener, inject, QueryList, ViewChildren } from '@angular/core';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { TextMessageComponent } from '../../components/text-message/text-message.component';
import { MessagesService } from '../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { PostMessageDto } from "../../shared/dtos/PostMessageDto";
import { messageRSignalService } from '../../services/messages/messageRSignal.service';
import { ToastrService } from 'ngx-toastr';
import { messageTypeEnum } from '../../shared/enums/MessageTypeEnum';
import { PutMessageDto } from '../../shared/dtos/PutMessageDto';
import { AuthService } from '../../services/account/auth.service';
import { BinaryMessageSearchById, BinaryMessageSearchOnScreen } from '../../shared/utility/BinaryMessageSearch';
import { ChannelService } from '../../services/channel/channel.service';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [CommonModule, TextInputComponent, TextMessageComponent],
  templateUrl: './direct-messages.component.html',
})

export class DirectMessagesComponent {
  inputBarHeight: number = 56
  wasAtBottomOfPage: boolean = true
  showMessagesToastr: number[] = []
  messages: MessageDto[] = []
  channelId: string = ""
  userId: number = 0
  messagesPage: number = 1
  messagesMaxPage: number = 2
  wasLastAddedPageUp: boolean = true
  awaitForMessagesCallback: boolean = false
  inputReplyMessage: MessageDto | undefined;
  @ViewChildren('message') messageElements!: QueryList<TextMessageComponent>;

  private messageService = inject(MessagesService)
  private activatedRoute = inject(ActivatedRoute)
  private toastrService = inject(ToastrService)
  private authService = inject(AuthService)

  constructor(private messageRSignal: messageRSignalService) {
    messageRSignal.recivedEditedMessage.asObservable().subscribe((value) => {
      let messageIndex = this.messages.findIndex(x => x.id === value.id);
      if (messageIndex !== -1) {
        this.messages = this.messages.map((message, i) => 
          i === messageIndex ? { ...message = value} : message
        );
      }
    });
    messageRSignal.recivedMessage.asObservable().subscribe((value) => {
        this.messages.push(value)
        this.messageService.saveMessage(this.channelId, value)
        if (value.authorId != this.userId && !this.wasAtBottomOfPage) {
          if (value.messageTypeEnum != messageTypeEnum.Text) {
            this.addToastr(value, "warning")
          }
          else{
            // Trim message to 40 characters
            if (value.messageText.length > 40) {
              value.messageText = value.messageText.substring(0, 40) + "..."
            }
            this.addToastr(value, "info")
          }
        }
        if (this.messages.length > 100) {
          this.messages.shift()
        }
    });
    messageRSignal.deletedMessage.asObservable().subscribe((value) => {
      let messageIndex = this.messages.findIndex(x => x.id === value.id);
      if (messageIndex !== -1) {
        this.messages = this.messages.map((message, i) => 
          i === messageIndex ? { ...message = value} : message
        );
        if (value.messageTypeEnum != messageTypeEnum.Text && !this.wasAtBottomOfPage && value.authorId != this.userId) {
          this.addToastr(value, "warning")
        }
      }
    });
  }

  getMessages(page: number, isDirectionUp: boolean){
    this.activatedRoute.paramMap.subscribe(params => {
    this.channelId = params.get('id')!
    this.messageService.getMessagesFromChannel(this.channelId, 50, page)
      .pipe(
        tap(x => {
          if (isDirectionUp) {
            this.messages.unshift(...x.items)
            if (this.messages.length > 100) {
              this.messages.splice(101, this.messages.length-100)
            }
          }
          else{
            this.messages = this.messages.concat(x.items)
            if (this.messages.length > 100) {
              this.messages.splice(0, this.messages.length-100)
              console.log(this.messages);
            }
          }
          this.messagesMaxPage = x.totalPages
          this.awaitForMessagesCallback = false
        })
      ).subscribe()
    });
  }

  ngAfterViewInit() {
    this.messageElements.changes.subscribe(_ => this.onItemElementsChanged());
    if (this.messages.length != 0) {
      this.onItemElementsChanged()
    }
    // TEMPORARY FIX !!!
    setTimeout(() => {
      let savedMessages = this.messageService.getSavedMessages(this.channelId)
      if (savedMessages != null && savedMessages.length != 0) {
        this.messages = savedMessages
      }
    }, 1);
    
    this.getMessages(this.messagesPage, true)
  }
  
  ngOnInit(){
    this.messageRSignal.connect()
      .then((x) => 
        {
          this.toastrService.clear(this.showMessagesToastr[0])
          this.showMessagesToastr = []
          if (x) {
            this.toastrService.success("Connected to the server")
            
          }
          else{
            this.toastrService.error("Failed to connect to the server")
          }
        })
    this.userId = this.authService.getJwtData()!.id
    this.showMessagesToastr.push(this.toastrService.info("Connecting to the server..", "Info", {disableTimeOut: true}).toastId)
  }

  onItemElementsChanged(){
    if (this.wasAtBottomOfPage) {
      window.scrollTo(0,document.body.scrollHeight);
      this.wasAtBottomOfPage = false
    }
  }

  addToastr(value: MessageDto, type: string){
    switch (type) {
      case "info":
          this.showMessagesToastr.push(this.toastrService.info(value.messageText, value.authorName, {disableTimeOut: true}).toastId)
        break;
      case "warning":
          this.showMessagesToastr.push(this.toastrService.warning(value.messageText, value.authorName, {disableTimeOut: true}).toastId)
        break;
    }
  
    if (this.showMessagesToastr.length > 3) {
      this.toastrService.clear(this.showMessagesToastr[0])
      this.showMessagesToastr.shift()
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) { // If at the bottom of page
      this.wasAtBottomOfPage = true
      // Clear every toastr
      // for (let x = 0; x < this.showMessagesToastr.length; x++){
      //   this.toastrService.clear(this.showMessagesToastr[x])
      // }
      // this.showMessagesToastr = []
    }
    else{
      this.wasAtBottomOfPage = false
      if (window.scrollY < document.body.scrollHeight * 0.15 && !this.awaitForMessagesCallback && this.messagesPage-1 != this.messagesMaxPage) {
        this.awaitForMessagesCallback = true
        if (!this.wasLastAddedPageUp) {
          this.messagesPage += 1
        }
        this.messagesPage += 1
        this.wasLastAddedPageUp = true
        this.getMessages(this.messagesPage, true)
      }
      if (window.innerHeight + window.scrollY > document.body.scrollHeight * 0.85 && !this.awaitForMessagesCallback && this.messagesPage >= 2) {
        this.awaitForMessagesCallback = true
        this.messagesPage -= 1
        if (this.wasLastAddedPageUp) {
          this.messagesPage -= 1
        }
        this.wasLastAddedPageUp = false
        this.getMessages(this.messagesPage, false)
      }
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

  replyMessage(message: MessageDto){
    this.inputReplyMessage = message
  }

  takeToMessage(messageId: number){
    let messages = this.messageElements.toArray()
    let messageIndex = BinaryMessageSearchById(messages, messageId)
    window.scrollTo(0, messages[messageIndex].getOffsetHeight() - (window.innerHeight/2));
    messages[messageIndex].showAnimation()
  }
}
