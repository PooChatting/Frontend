import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { MessageDto } from "../../shared/dtos/MessageDto";
import { environment } from "../../../environments/environments";
import { AuthHeader } from "../authenticationHeader.service";
import { PostMessageDto } from "../../shared/dtos/PostMessageDto";
import { PutMessageDto } from "../../shared/dtos/PutMessageDto";
import { PagedResult } from "../../shared/dtos/PagedResult";

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  private httpClient = inject(HttpClient)
  private authHeader = inject(AuthHeader)
  
  saveMessages(channel: string, messages: MessageDto[]) {
    localStorage.setItem(`${channel}savedMessages`, JSON.stringify(messages));
  }

  saveMessage(channel: string, message: MessageDto) {
    let saved = localStorage.getItem(`${channel}savedMessages`)!
    let messages = JSON.parse(saved) as MessageDto[]
    messages = messages.concat(message)
    messages.splice(0, messages.length-100)
    localStorage.setItem(`${channel}savedMessages`, JSON.stringify(messages));
  }

  getSavedMessages(channel: string): MessageDto[] | null {
    let saved = localStorage.getItem(`${channel}savedMessages`)!
    return JSON.parse(saved)
  }

  getMessagesFromChannel(channelId: string, pageSize: number, pageNumber: number): Observable<PagedResult<MessageDto>> {
    if (pageNumber == 1) {
      let savedMessages = this.getSavedMessages(channelId)
      if (savedMessages != null && savedMessages.length != 0) {
        let pagedResults : PagedResult<MessageDto> = {items: savedMessages, page: pageNumber, totalItems: 300, totalPages: 100}
        return of(pagedResults)
      }
    }

    let messages = this.httpClient
    .get<PagedResult<MessageDto>>(
      `${environment.apiUrl}/message/channel/${channelId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {responseType: "json", headers: this.authHeader.getAuthenticationHeader()})

    if (pageNumber == 0) {
      messages.pipe(
        tap(x => {
          this.saveMessages(channelId, x.items)
        }
      )).subscribe()
    }

    return messages
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

  deleteMessage(messageId: number) {
    return this.httpClient
      .delete(
        `${environment.apiUrl}/message/${messageId.toString()}`,
        {responseType: "json", observe: 'response', headers: this.authHeader.getAuthenticationHeader()})
  }

}
