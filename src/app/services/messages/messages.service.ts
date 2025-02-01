import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, of, pipe, switchMap, tap, throwError } from "rxjs";
import { MessageDto } from "../../shared/dtos/MessageDto";
import { environment } from "../../../environments/environments";
import { AuthHeader } from "../authenticationHeader.service";
import { PostMessageDto } from "../../shared/dtos/PostMessageDto";
import { PutMessageDto } from "../../shared/dtos/PutMessageDto";
import { PagedResult } from "../../shared/dtos/PagedResult";
import { ChannelService } from "../channel/channel.service";
import { AuthService } from "../account/auth.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  private httpClient = inject(HttpClient)
  private authHeader = inject(AuthHeader)
  private channelService = inject(ChannelService)
  private authService = inject(AuthService)
  private routerService = inject(Router)
  
  saveMessages(channel: string, messages: MessageDto[]) {
    localStorage.setItem(`${channel}savedMessages`, JSON.stringify(messages));
  }

  saveMessage(channel: string, message: MessageDto) {
    let saved = localStorage.getItem(`${channel}savedMessages`)!
    let messages = JSON.parse(saved) as MessageDto[]
    messages = messages.concat(message)
    messages.shift()
    localStorage.setItem(`${channel}savedMessages`, JSON.stringify(messages));
  }

  getSavedMessages(channel: string): Observable<PagedResult<MessageDto>> | null {
    let saved = localStorage.getItem(`${channel}savedMessages`)!

    if (saved == "") {
      return null
    }
    let pagedResults: PagedResult<MessageDto> = {
      items: JSON.parse(saved),
      page: 1,
      totalItems: 300,
      totalPages: 100
    };
    return of(pagedResults);
  }

  getNewestSavedMessage(channel: string): MessageDto | null {
    let saved = localStorage.getItem(`${channel}savedMessages`)!
    let messages = JSON.parse(saved) as MessageDto[]
    if (messages == null) {
      return null
    }
    return messages[messages.length-1]
  }

  getMessagesFromChannel(channelId: string, pageSize: number, pageNumber: number): Observable<PagedResult<MessageDto>> {
    if (pageNumber == 1) {
      let newest = this.getNewestSavedMessage(channelId)
      if (newest?.authorId == this.authService.getJwtData()?.id && newest?.hadBeenRead == true) {
        return this.getSavedMessages(channelId)!;
      }
      this.channelService.checkIfUpToDate(channelId).pipe(
        tap((isUpToDate) => {
          
          if (isUpToDate) {
            return this.getSavedMessages(channelId)!;
          }
          
          let messages = this.httpClient.get<PagedResult<MessageDto>>(
            `${environment.apiUrl}/message/channel/${channelId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
            { responseType: "json", headers: this.authHeader.getAuthenticationHeader() }
            );
          messages.pipe(
            tap(x => {
              this.saveMessages(channelId, x.items)
            }
          )).subscribe()
          return messages
        }),
        catchError(err => {
          if (err.status == 401) {
            this.routerService.navigateByUrl("/login")
          }
          if (err.status == 403) {
            this.routerService.navigateByUrl("/dm")
          }
          return ""
        })
      ).subscribe();
    }

    let messages = this.httpClient
    .get<PagedResult<MessageDto>>(
      `${environment.apiUrl}/message/channel/${channelId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {responseType: "json", headers: this.authHeader.getAuthenticationHeader()})

    return messages
  }

  getMessagesNearId(channelId: string, messageId: number, pageSize: number, pageNumber: number){
    return this.httpClient
    .get<PagedResult<MessageDto>>(
      `${environment.apiUrl}/message/${channelId}/${messageId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
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

  deleteMessage(messageId: number) {
    return this.httpClient
      .delete(
        `${environment.apiUrl}/message/${messageId.toString()}`,
        {responseType: "json", observe: 'response', headers: this.authHeader.getAuthenticationHeader()})
  }

}
