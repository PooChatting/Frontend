import { EventEmitter, inject, Injectable, Output } from "@angular/core";
import { MessageDto } from "../../shared/dtos/MessageDto";
import * as signalR from '@microsoft/signalr';
import { AuthService } from "../account/auth.service";
import { messageTypeEnum } from "../../shared/enums/MessageTypeEnum";

@Injectable({
  providedIn: 'root'
})

export class messageRSignalService {
    private hubConnection: signalR.HubConnection | undefined;
    private authService = inject(AuthService)

    @Output() recivedMessage = new EventEmitter<MessageDto>();
    @Output() recivedEditedMessage = new EventEmitter<MessageDto>();
    @Output() deletedMessage = new EventEmitter<MessageDto>();

    async connect(): Promise<boolean> {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:44355/chatHub', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => this.authService.getJwtData()!.jwtToken
        })
        .build();

      this.hubConnection.on('ReceiveEditedMessage', (message) => {
        let msg = JSON.parse(message)
        let msgModel: MessageDto = {
          authorId: msg.AuthorId,
          authorProfile: "",
          authorName: msg.AuthorName,
          channelId: msg.ChannelId,
          id: msg.Id,
          messageText: msg.MessageText,
          publication: msg.Publication,
          wasEdited: msg.WasEdited,
          messageTypeEnum: messageTypeEnum[msg.MessageTypeEnum as keyof typeof messageTypeEnum],
          replyToId: msg.ReplyToId,
          hadBeenRead: msg.HadBeenRead
        }
        this.recivedEditedMessage.emit(msgModel)
      });

      this.hubConnection.on('ReceiveMessage', (message) => {
        let msg = JSON.parse(message)
        
        let msgModel: MessageDto = {
          authorId: msg.AuthorId,
          authorProfile: "",
          authorName: msg.AuthorName,
          channelId: msg.ChannelId,
          id: msg.Id,
          messageText: msg.MessageText,
          publication: msg.Publication,
          wasEdited: msg.WasEdited,
          messageTypeEnum: messageTypeEnum[msg.MessageTypeEnum as keyof typeof messageTypeEnum],
          replyToId: msg.ReplyToId,
          hadBeenRead: msg.HadBeenRead
        }
        this.recivedMessage.emit(msgModel)
      });

      this.hubConnection.on('deleteMessage', (message) => {
        let msg = JSON.parse(message)
        let msgModel: MessageDto = {
          authorId: msg.AuthorId,
          authorProfile: "",
          authorName: msg.AuthorName,
          channelId: msg.ChannelId,
          id: msg.Id,
          messageText: msg.MessageText,
          publication: msg.Publication,
          wasEdited: msg.WasEdited,
          messageTypeEnum: messageTypeEnum[msg.MessageTypeEnum as keyof typeof messageTypeEnum],
          replyToId: msg.ReplyToId,
          hadBeenRead: msg.HadBeenRead
        }
        this.deletedMessage.emit(msgModel)
      });

      this.hubConnection.on('userConnected', (message) => {
        console.log(message);
        
      });
      
      return this.hubConnection.start()
        .then(() => { return true })
        .catch(() => { return false });
    }
}
