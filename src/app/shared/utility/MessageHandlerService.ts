import { HostListener, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { messageRSignalService } from '../../services/messages/messageRSignal.service';
import { AuthService } from '../../services/account/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MessageDto } from '../dtos/MessageDto';
import { messageTypeEnum } from '../enums/MessageTypeEnum';
import { MessagesService } from '../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MessageHandlerService {
  userId: number = 0;
  channelId: string = "";
  newestMessageId: number = 0;
  isAtBottomOfPage = true;
  showMessagesToastr: number[] = []

  private messagesSubject = new BehaviorSubject<MessageDto[]>([]);
  messages$ = this.messagesSubject.asObservable();
  
  private toastrService = inject(ToastrService)
  private authService = inject(AuthService)
  private messageService = inject(MessagesService)
  private activatedRoute = inject(ActivatedRoute)
  private messageRSignal = inject(messageRSignalService)


  messageServiceInitializer(){
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

    this.messageRSignal.recivedEditedMessage.asObservable().subscribe((value) => { // Add so that if its in page 1 it saves that edited message
      const messages = this.messagesSubject.value;
      const messageIndex = messages.findIndex(x => x.id === value.id);
      if (messageIndex !== -1) {
        messages[messageIndex] = { ...messages[messageIndex], ...value };
        this.messagesSubject.next([...messages]);
      }
    });

    this.messageRSignal.recivedMessage.asObservable().subscribe((value) => {
      let messages = this.messagesSubject.value;
      
      if (messages[messages.length-1].id == this.newestMessageId) {
        if (value.authorId !== this.userId) {
          value.hadBeenRead = true;
        }
        messages.push(value);
        this.messagesSubject.next([...messages]);
        this.messageService.saveMessage(this.channelId, value);
        this.newestMessageId = value.id
      }
      
      if (!this.isAtBottomOfPage) {
        if (value.messageTypeEnum != messageTypeEnum.Text) {
          this.addToastr(value, 'warning');
          
        } else {
          if (value.messageText.length > 40) {
            value.messageText = value.messageText.substring(0, 40) + '...';
          }
          this.addToastr(value, 'info');
        }
      }

      if (messages.length > 100) {
        messages.shift();
        this.messagesSubject.next([...messages]);
      }
    });

    this.messageRSignal.deletedMessage.asObservable().subscribe((value) => { // Add so that if its in page 1 it saves that edited message
      const messages = this.messagesSubject.value;
      const messageIndex = messages.findIndex(x => x.id === value.id);
      if (messageIndex !== -1) {
        messages.splice(messageIndex, 1);
        this.messagesSubject.next([...messages]);
      }
    });

    this.messageRSignal.readMessage.asObservable().subscribe((value) => { // Add so that if its in page 1 it saves that edited message
      const messages = this.messagesSubject.value.map((message) =>
        !message.hadBeenRead && message.authorId === this.userId
          ? { ...message, hadBeenRead: true }
          : message
      );
      this.messagesSubject.next(messages);
    });
  }
  

  setMessages(messagesInput: MessageDto[], channel: string, newestMessage: number) {
    this.messagesSubject.next(messagesInput);
    this.channelId = channel
    this.newestMessageId = newestMessage
  }

  setIsAtBottomOfPage(isAtTheBottom: boolean) {
    this.isAtBottomOfPage = isAtTheBottom
    if (isAtTheBottom) {
      this.toastrService.clear()
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
}
