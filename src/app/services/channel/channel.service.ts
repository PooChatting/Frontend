import {HttpClient} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { AuthHeader } from "../authenticationHeader.service";
import { AuthService } from "../account/auth.service";
import { ChannelDto } from "../../shared/dtos/ChannelDto";

@Injectable({
  providedIn: 'root'
})

export class ChannelService {

  private httpClient = inject(HttpClient)
  private authHeader = inject(AuthHeader)
  
  addToChannel(channelId: string) {
    return this.httpClient
      .put(
        `${environment.apiUrl}/channel/${channelId}/user`, "",
        {headers: this.authHeader.getAuthenticationHeader()})
  }

  checkIfUpToDate(channelId: string) {
    return this.httpClient
      .get<boolean>(
        `${environment.apiUrl}/channel/${channelId}/isUpToDate`,
        {headers: this.authHeader.getAuthenticationHeader()})
  }

  getUserChannels(){
    return this.httpClient
      .get<ChannelDto[]>(
        `${environment.apiUrl}/channel/user`,
        {headers: this.authHeader.getAuthenticationHeader()})
  }

}
