import { Component, HostListener, inject, QueryList, ViewChildren } from '@angular/core';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { TextMessageComponent } from '../../components/text-message/text-message.component';
import { MessagesService } from '../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { PostMessageDto } from "../../shared/dtos/PostMessageDto";
import { MessageReciverService } from '../../services/messages/messageReciver.service';
import { ToastrService } from 'ngx-toastr';

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

  @ViewChildren('message') messageElements!: QueryList<any>;

  private messageService = inject(MessagesService)
  private activatedRoute = inject(ActivatedRoute)
  private toastrService = inject(ToastrService)

  constructor(private messageReciver: MessageReciverService) {
    messageReciver.recivedMessage.asObservable().subscribe((value: any) => {
        this.messages.push(value)
    });
  }

  ngAfterViewInit() {
    this.messageElements.changes.subscribe(_ => this.onItemElementsChanged(_));
  }

  onItemElementsChanged(el: any){
    let lastMessage: MessageDto = el.last.messageDto as MessageDto

    if (this.wasAtBottomOfPage) {
      window.scrollTo(0,document.body.scrollHeight);
      this.wasAtBottomOfPage = false
    }
    else{
      // Trim message to 40 characters
      if (lastMessage.messageText.length > 40) {
        lastMessage.messageText = lastMessage.messageText.substring(0, 40) + "..."
      }
      
      // Show toastr and save it's id
      this.showMessagesToastr.push(this.toastrService.info(lastMessage.messageText, lastMessage.authorName, {disableTimeOut: true}).toastId)
      
      // If there is too mush toastrs remove oldest
      if (this.showMessagesToastr.length > 3) {
        this.toastrService.clear(this.showMessagesToastr[0])
        this.showMessagesToastr.shift()
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.wasAtBottomOfPage = true
      // Clear every toastr
      for (let x = 0; x < this.showMessagesToastr.length; x++){
        this.toastrService.clear(this.showMessagesToastr[x])
      }
      this.showMessagesToastr = []
    }
    else{
      this.wasAtBottomOfPage = false
    }
  }

  ngOnInit(){
    this.messageReciver.connect()
    this.getMessages()
  }

  getMessages(){
    this.activatedRoute.paramMap.subscribe(params => {
    this.channelId = params.get('id')!
    this.messageService.getMessagesFromChannel(this.channelId)
      .pipe(
        tap(x => {
          this.messages = x
        })
      ).subscribe()
    });
  }

  sendMessage(message: string){
    let data: PostMessageDto = {channelId: this.channelId, messageText: message}
    this.messageService.postMessage(data).pipe().subscribe()
  }
  
  // @HostListener('document:keyup', ['$event'])
  // onKeyUp (event: KeyboardEvent) {
  //   if (event.key == "PrintScreen") {
      
  //   }
  // }

  
}
