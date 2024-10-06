import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MessageDto } from "../../shared/dtos/MessageDto";
import { environment } from "../../../environments/environments";
import { AuthHeader } from "../authenticationHeader.service";
import { PostMessageDto } from "../../shared/dtos/PostMessageDto";
import { PutMessageDto } from "../../shared/dtos/PutMessageDto";

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  private httpClient = inject(HttpClient)
  private authHeader = inject(AuthHeader)
  
  getMessagesFromChannel(channelId: string): Observable<MessageDto[]> {
    return this.httpClient
      .get<MessageDto[]>(
        `${environment.apiUrl}/message/channel/${channelId}`,
        {responseType: "json", headers: this.authHeader.getAuthenticationHeader()})
  }
  
  postMessage(messageDto: PostMessageDto) {
    return this.httpClient
      .post(
        `${environment.apiUrl}/message`, messageDto,
        {responseType: "json", headers: this.authHeader.getAuthenticationHeader()})
  }
  
  putMessage(messageDto: PutMessageDto) {
    return this.httpClient
      .put(
        `${environment.apiUrl}/message`, messageDto,
        {responseType: "json", observe: 'response', headers: this.authHeader.getAuthenticationHeader()})
  }

}
