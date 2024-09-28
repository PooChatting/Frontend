import { Component, inject } from '@angular/core';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { TextMessageComponent } from '../../components/text-message/text-message.component';
import { MessagesService } from '../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { MessageDto } from '../../shared/dtos/MessageDto';
import { ChannelService } from '../../services/channel/channel.service';
import { PostMessageDto } from "../../shared/dtos/PostMessageDto";

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [CommonModule, TextInputComponent, TextMessageComponent],
  templateUrl: './direct-messages.component.html',
})
export class DirectMessagesComponent {

  private messageService = inject(MessagesService)
  private activatedRoute = inject(ActivatedRoute)

  messages: MessageDto[] = []
  channelId: string = ""
  ngOnInit(){
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
